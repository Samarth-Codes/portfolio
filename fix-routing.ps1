Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Portfolio Admin Route Fix Script" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

# Step 1: Clear npm cache
Write-Host "Step 1: Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force
Write-Host "✅ npm cache cleared`n" -ForegroundColor Green

# Step 2: Browser cache instructions
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  MANUAL STEP: Clear Browser Cache" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "`nPlease do the following BEFORE proceeding:" -ForegroundColor Yellow
Write-Host "  1. Press Ctrl + Shift + Delete" -ForegroundColor White
Write-Host "  2. Select 'All time'" -ForegroundColor White
Write-Host "  3. Check 'Cached images and files'" -ForegroundColor White
Write-Host "  4. Check 'Cookies and other site data'" -ForegroundColor White
Write-Host "  5. Click 'Clear data'" -ForegroundColor White
Write-Host "  6. Close your browser completely`n" -ForegroundColor White

Read-Host "Press Enter AFTER you've cleared browser cache"

# Step 3: Verify dev server is running
Write-Host "`nStep 2: Checking development servers..." -ForegroundColor Yellow
Write-Host "Make sure both servers are running:" -ForegroundColor White
Write-Host "  - Backend: cd server && npm start" -ForegroundColor White
Write-Host "  - Frontend: npm start`n" -ForegroundColor White

# Step 4: Test instructions
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Testing Instructions" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "`n1. Open browser in INCOGNITO/PRIVATE mode" -ForegroundColor Yellow
Write-Host "   Chrome/Edge: Ctrl + Shift + N" -ForegroundColor White
Write-Host "   Firefox: Ctrl + Shift + P`n" -ForegroundColor White

Write-Host "2. Test these URLs:" -ForegroundColor Yellow
Write-Host "   http://localhost:3000/" -ForegroundColor White
Write-Host "   http://localhost:3000/admin" -ForegroundColor White
Write-Host "   http://localhost:3000/projects`n" -ForegroundColor White

Write-Host "3. In DevTools (F12):" -ForegroundColor Yellow
Write-Host "   - Go to Network tab" -ForegroundColor White
Write-Host "   - Check 'Disable cache'" -ForegroundColor White
Write-Host "   - Refresh the page`n" -ForegroundColor White

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "The /admin route should work now!" -ForegroundColor Green
Write-Host "============================================`n" -ForegroundColor Cyan
