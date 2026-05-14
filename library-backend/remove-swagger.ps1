$controllers = @(
    "d:\lenovo\Documents\library-backend\src\main\java\com\library\controller\AdminController.java",
    "d:\lenovo\Documents\library-backend\src\main\java\com\library\controller\AuthController.java",
    "d:\lenovo\Documents\library-backend\src\main\java\com\library\controller\BookController.java",
    "d:\lenovo\Documents\library-backend\src\main\java\com\library\controller\BorrowController.java",
    "d:\lenovo\Documents\library-backend\src\main\java\com\library\controller\CategoryController.java",
    "d:\lenovo\Documents\library-backend\src\main\java\com\library\controller\CommentController.java",
    "d:\lenovo\Documents\library-backend\src\main\java\com\library\controller\ShelfController.java"
)

foreach ($file in $controllers) {
    Write-Host "Processing $file"
    $content = Get-Content $file -Raw
    
    # Remove Swagger imports
    $content = $content -replace "io\.swagger\.v3\.oas\.annotations\.[^\r\n]+\r?\n", ""
    $content = $content -replace "io\.swagger\.v3\.oas\.annotations\.tags\.[^\r\n]+\r?\n", ""
    
    # Remove @Tag, @Operation, @Parameter annotations
    $content = $content -replace "@Tag\([^)]+\)\r?\n", ""
    $content = $content -replace "@Operation\([^)]+\)\r?\n", ""
    $content = $content -replace "@Parameter\([^)]+\)\r?\n", ""
    
    Set-Content $file $content -NoNewline
    Write-Host "Done: $file"
}