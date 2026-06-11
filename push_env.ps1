$env1 = "VITE_FIREBASE_API_KEY"
$val1 = "AIzaSyBw7h8VuOU7I_EZnkfEV7F-UF_DriSOsyk"
Write-Output $val1 | npx vercel env add $env1 production --yes

$env2 = "VITE_FIREBASE_AUTH_DOMAIN"
$val2 = "tenspilot.firebaseapp.com"
Write-Output $val2 | npx vercel env add $env2 production --yes

$env3 = "VITE_FIREBASE_PROJECT_ID"
$val3 = "tenspilot"
Write-Output $val3 | npx vercel env add $env3 production --yes

$env4 = "VITE_FIREBASE_STORAGE_BUCKET"
$val4 = "tenspilot.firebasestorage.app"
Write-Output $val4 | npx vercel env add $env4 production --yes

$env5 = "VITE_FIREBASE_MESSAGING_SENDER_ID"
$val5 = "65017237970"
Write-Output $val5 | npx vercel env add $env5 production --yes

$env6 = "VITE_FIREBASE_APP_ID"
$val6 = "1:65017237970:web:42c20bca0be859c35ff80b"
Write-Output $val6 | npx vercel env add $env6 production --yes

Write-Host "Firebase Variables added to Doctor Dashboard"
