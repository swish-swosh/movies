<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use Exception;
use Illuminate\Support\Facades\Auth;

use App\Models\Role;
use App\Models\User; 

use GuzzleHttp\Client;

use Illuminate\Http\Request;
use App\Http\Requests\UserRequest;

use App\Http\Resources\UserResource;

use Laravel\Passport\Client as OAuthClient;

class UserController extends Controller
{
    public function registerUser(UserRequest $request) {

        $password = $request->password;
        $input = $request->all(); 
        $input['password'] = bcrypt($input['password']);

        // create user
        $user = User::create($input);

        // set new user default role to 'admin' !
        // check this for a production site.
        // sync roles to use this.
        $role = Role::select('id')->firstWhere('name', 'admin');
        $user->roles()->sync([$role->id]);

        // return accessToken and Refresh token to front end.
        $oAuthClient = OAuthClient::where('password_client', 1)->first();
        return response()->json(
            $this->getTokenAndRefreshToken($oAuthClient, request('email'), request('password'))
            , 200);
    }

    public function retrieveUser() { 
        $user = Auth::user();
        return (new UserResource($user));
    }

    public function getTokenAndRefreshToken(OAuthClient $oAuthClient, $email, $password) { 
        $oAuthClient = OAuthClient::where('password_client', 1)->first();
        $http = new Client;
        $response = $http->request('POST', route('passport.token'), [
            'form_params' => [
                'grant_type' => 'password',
                'client_id' => $oAuthClient->id,
                'client_secret' => $oAuthClient->secret,
                'username' => $email,
                'password' => $password,
                'scope' => '*',
            ],
        ]);
        return json_decode((string) $response->getBody(), true);
    }

    // after login tokens are used for secure OAUTH communication
    public function login() { 
        if (Auth::attempt(['email' => request('email'), 'password' => request('password')])) { 
            $oAuthClient = OAuthClient::where('password_client', 1)->first();
            return $this->getTokenAndRefreshToken($oAuthClient, request('email'), request('password'));
        } 
        else { 
            return response()->json(['message'=>'Unauthorised'], 401);  
        } 
    }

    public function logout(Request $request) {
        $request->user()->token()->revoke();
        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }

    public function unauthorized() { 
        return response()->json(['message'=>'Unauthorised'], 401); 
    }

    // get a new refresh token
    public function refreshToken(Request $request) { 

        $refresh_token = $request->header('refreshToken');
        $oAuthClient = OAuthClient::where('password_client', 1)->first();
        $http = new Client;

        try {
            $response = $http->request('POST', route('passport.token'), [
                'form_params' => [
                    'grant_type' => 'refresh_token',
                    'refresh_token' => $refresh_token,
                    'client_id' => $oAuthClient->id,
                    'client_secret' => $oAuthClient->secret,
                    'scope' => '*',
                ],
            ]);
            return json_decode((string) $response->getBody(), true);
        } catch (Exception $e) {
            return response()->json(['message'=>'Unauthorised'], 401); 
        }
    }
    
    /**
     * Remove the specified resource from storage.DEtach piv
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
        $user->delete();
        return response(['message'=>'User deleted']);
    }

}
