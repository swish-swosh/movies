<?php

namespace App\Http\Controllers\Api;
use Illuminate\Http\Request;
use Illuminate\Auth\Access\Response;

use App\Models\User;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Http;

class MovieController extends Controller
{

    public function __construct()
    {
        // force authentication through the api middleware
        $this->middleware('auth:api');

        // view routes/api.php for additional middleware used here, 
        // as policies can't work here, no models used.
    }

    /**
     * Display a listing of the themoviedb.org/3/discover/movie.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $params = strrchr( $request->fullUrl(), '?');
        return Http::withToken(config('services.tmdb.token'))
            ->get('https://api.themoviedb.org/3/discover/movie'.$params)
            ->json();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function credits($id)
    {
        return Http::withToken(config('services.tmdb.token'))
            ->get('https://api.themoviedb.org/3/movie/'.$id.'/credits')
            ->json();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Http::withToken(config('services.tmdb.token'))
            ->get('https://api.themoviedb.org/3/movie/'.$id)
            ->json();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function configuration()
    {
        return Http::withToken(config('services.tmdb.token'))
            ->get('https://api.themoviedb.org/3/configuration')
            ->json();
    }
}
