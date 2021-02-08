<?php

namespace App\Exceptions;

use Throwable;
use PDOException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\Eloquent\RelationNotFoundException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

        /**
     * Report or log an exception.
     *
     * @param  \Throwable  $exception
     * @return void
     *
     * @throws \Exception
     */
    public function report(Throwable $exception)
    {
        parent::report($exception);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Throwable  $exception
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @throws \Throwable
     */
    public function render($request, Throwable $exception)
    {

        if ($exception instanceof NotFoundHttpException) {
            return response()->json(['message' => 'Http page not found'], 404);
        }
        
        if ($exception instanceof ModelNotFoundException) {
            return response()->json(['message' => 'Not found'], 404);
        }

        if ($exception instanceof Error) {
            return response()->json(['message' => 'Not found, including relation'], 404);
        }

        if ($exception instanceof AuthorizationException) {
            return response()->json(['message' => 'Unauthorized....'], 403);
        }

        if ($exception instanceof \PDOException) {
            return response()->json(['message' => 'Unable to write to database: '.substr($exception, 0, 300).'...'], 500);
        }
        
        return parent::render($request, $exception);
    }
}
