<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\MovieController;
use App\Http\Controllers\Api\CreditController;
use App\Http\Controllers\Api\KeywordController;
use App\Http\Controllers\Api\RoleController;

use Laravel\Passport\Http\Middleware\CheckClientCredentials;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::post('login', [UserController::class, 'login']);
Route::post('registerUser', [UserController::class, 'registerUser']);
Route::post('refreshToken', [UserController::class, 'refreshToken']);
Route::get('/unauthorized', [UserController::class, 'unauthorized']);

Route::middleware([CheckClientCredentials::class, 'auth:api'])->group(function () {
    Route::post('retrieveUser', [UserController::class, 'retrieveUser']);
    Route::post('logout', [UserController::class, 'logout']);
});

// none resource controllers, not using models
Route::get('movies', [MovieController::class, 'index'])->middleware('role:admin');
Route::get('movies/{id}', [MovieController::class, 'show'])->middleware('role:admin');
Route::get('movies/credits/{id}', [MovieController::class, 'credits'])->middleware('role:admin');
Route::get('configuration', [MovieController::class, 'configuration'])->middleware('role:admin');

// all resources controllers demand authentication.
Route::resources([
    'search/keyword' => KeywordController::class,
    'roles' => RoleController::class,
]);
