<?php

namespace App\Providers;

use App\Models\Role;
use App\Models\User;

use App\Policies\RolePolicy;
use Laravel\Passport\Client;

use Laravel\Passport\Passport;

use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        Role::class => RolePolicy::class
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        Passport::routes();
        Passport::tokensExpireIn(now()->addMinutes(480));           // 8u
        Passport::refreshTokensExpireIn(now()->addMinutes(1140));    // 24u
    }
}
