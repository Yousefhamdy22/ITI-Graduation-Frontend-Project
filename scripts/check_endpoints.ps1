# Checks GET endpoints of the frontend against the backend base URL
# Non-destructive: skips POST/PUT/DELETE endpoints

$base = 'http://localhost:5180'

$endpoints = @(
  @{ name='Courses - GetAll'; method='GET'; path='/api/Course/GetAllCourses' },
  @{ name='Courses - GetById'; method='GET'; path='/api/Course/GetCourseById/{id}' },

  @{ name='Students - All'; method='GET'; path='/api/Students' },
  @{ name='Students - ById'; method='GET'; path='/api/Students/{id}' },
  @{ name='Students - ByUserId'; method='GET'; path='/api/Students/user/{id}' },
  @{ name='Students - CourseEnrollment'; method='GET'; path='/api/Students/CourseEnrollment/{id}' },
  @{ name='Students - GetAllWithEnrollments'; method='GET'; path='/api/Students/GetAllWithEnrollments' },

  @{ name='Questions - All'; method='GET'; path='/api/Question/GetAllQuestions' },
  @{ name='Questions - ById'; method='GET'; path='/api/Question/GetQuestionById/{id}' },

  @{ name='Lectures - ByModule'; method='GET'; path='/api/Lectures/ByModule/{id}' },
  @{ name='Lectures - ById'; method='GET'; path='/api/Lectures/{id}' },

  @{ name='Exams - All'; method='GET'; path='/api/Exams' },
  @{ name='Exams - ById'; method='GET'; path='/api/Exams/{id}' },
  @{ name='Exams - ByCourse'; method='GET'; path='/api/courses/{id}/exams' },

  @{ name='Instructors - All'; method='GET'; path='/api/Instructor/GetInstructors' },
  @{ name='Instructors - ById'; method='GET'; path='/api/Instructor/GetInstructorById/{id}' },

  @{ name='Enrollments - All'; method='GET'; path='/api/Enrollments' },
  @{ name='Enrollments - ById'; method='GET'; path='/api/Enrollments/{id}' },

  @{ name='Certificates - ViewMy'; method='GET'; path='/api/Certificates/ViewCertificate' }
)

$results = @()

Write-Host "Testing backend base: $base`n"

foreach ($e in $endpoints) {
  $full = $base + $e.path
  # If path contains {id} placeholder we'll try to fill it from list endpoints first
  if ($e.path -like '*{id}*') {
    # determine which collection to call to get an id
    $collectionCall = $null
    if ($e.name -like 'Courses*') { $collectionCall = '/api/Course/GetAllCourses' }
    elseif ($e.name -like 'Students*') { $collectionCall = '/api/Students' }
    elseif ($e.name -like 'Questions*') { $collectionCall = '/api/Question/GetAllQuestions' }
    elseif ($e.name -like 'Lectures*') { $collectionCall = '/api/Lectures' }
    elseif ($e.name -like 'Exams*') { $collectionCall = '/api/Exams' }
    elseif ($e.name -like 'Instructors*') { $collectionCall = '/api/Instructor/GetInstructors' }
    elseif ($e.name -like 'Enrollments*') { $collectionCall = '/api/Enrollments' }
    else { $collectionCall = $null }

    $idToUse = $null
    if ($collectionCall) {
      try {
        $listUrl = $base + $collectionCall
        $listResp = Invoke-RestMethod -Uri $listUrl -Method Get -TimeoutSec 10
        # Try to extract an id from first element
        if ($listResp -is [System.Array] -and $listResp.Length -gt 0) {
          $first = $listResp[0]
        } else { $first = $listResp }

        if ($first -ne $null) {
          $possibleKeys = @('id','Id','ID','courseId','CourseId','studentId','StudentId','instructorId','InstructorId','examId','ExamId')
          foreach ($k in $possibleKeys) {
            if ($first.PSObject.Properties.Name -contains $k) {
              $idToUse = $first.$k
              break
            }
          }
        }
      }
      catch {
        # ignore; we'll fall back to using a random guid
        $idToUse = $null
      }
    }

    if (-not $idToUse) { $idToUse = [guid]::NewGuid().ToString() }
    $full = $full -replace '\{id\}',$idToUse
  }
  if ($e.method -ne 'GET') {
    $results += [pscustomobject]@{ name=$e.name; path=$e.path; method=$e.method; status='skipped'; details='Non-GET (write) endpoint - not tested' }
    continue
  }

  Write-Host "Testing $($e.method) $full ... " -NoNewline
  try {
    $resp = Invoke-WebRequest -Uri $full -Method Get -UseBasicParsing -TimeoutSec 10
    $status = $resp.StatusCode
    $length = ($resp.Content).Length
    Write-Host "OK ($status)"
    $results += [pscustomobject]@{ name=$e.name; path=$e.path; method=$e.method; status=$status; details="OK; length=$length" }
  }
  catch {
    $err = $_.Exception.Message
    # Try to extract HTTP status code if available
    $statusCode = ''
    if ($_.Exception.Response -ne $null) {
      try { $statusCode = $_.Exception.Response.StatusCode.value__ } catch {}
    }
    if ($statusCode -ne '') { $details = "Error; status=$statusCode; msg=$err" } else { $details = "Error; msg=$err" }
    Write-Host "FAIL"
    $results += [pscustomobject]@{ name=$e.name; path=$e.path; method=$e.method; status='error'; details=$details }
  }
}

# Output summary
Write-Host "`nSummary:`n"
$results | Format-Table -AutoSize

# Save results to file
$outFile = Join-Path -Path (Split-Path -Parent $MyInvocation.MyCommand.Path) -ChildPath 'endpoint_results.json'
$results | ConvertTo-Json -Depth 4 | Out-File -FilePath $outFile -Encoding utf8
Write-Host "\nResults saved to: $outFile"

# Exit with non-zero if any errors
if ($results | Where-Object { $_.status -eq 'error' }) { exit 2 } else { exit 0 }
