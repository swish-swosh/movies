
<h1>TheMovieDB demo</h1>
<h2>Implemented using:</h2>

**Backend**: PHP 7.4, Laravel 8.x, passport 10.1, Laravel-cors 2.x, guzzle 7.04,...

**Frontend**: Bootstrap 4.6.x, Vue, 2.6.x, Vue-axios 2.1.x, Vuex 3.6.x, Vuex-persistedState 3.2.x, Vue-router3.5.x, ... Vue-bootstrap components, sass css templating, bootstrap 4 compatible (vue argon features).

**TheMovieDB**: Api version 3

**Overview**:

This demo version shows front and backend methods for theMovieDB API resources. I've taken some liberty in how to represent the frontend and UI/UX design. as a result, I consequently choose to use a 'searchable table' configuration where all data can be filtered, paginated, sorted and searched upon by date and keywords. This type of design is mostly found in user-friendly and feature-rich admin panels. If a more graphical representation (like such used in webshops) would be more favorable, then all it takes is to simply change the Vue bootstrap table with the appropriate templates using the same available data.

**Base URL application**: (localhost connection)
- http://movie-app/api/ backend
- http://movie-app/ frontend

**Live demo**:
https://movies.swish-swosh.com/ (feel free to register and test)

**Features**:
**Frontend** ( location: resources/js )
  * Filtering between the start and end date (calendar component).
  * Search by TheMovieDB provided keywords (keyword search component).
  * Pagination, using de appropriate buttons in the top and bottom sections of the table.
  * Filtering on designated column headers.
  * Detail selection by clicking a row + details button, or by double-clicking a single row.
  * Details containing title, genres, likes, votes, posters, and backdrops, link to IMDB site for more info, budget, cast, crew, ... easy reconfigurable and expanded via the Vue templates.
  * User create/login/logout/password-recovery management.
  * Form validations.
  * Url path (api) aware pages, including modals for credentials and movie details.
  * Breadcrumb.
  * Local storage using Vuex for user credentials ( access token, refresh token, expire date, and "remember me" state. Global settings that hold user roles. Tokens expire dates are set by the backend. Local storage is encrypted by default. (disabled when developing).
  * All project components are organized in the js frontend folder structure according to type, usage, and relationship with other parts. Code duplication is at its minimum and additional features can easily be included/removed.
  * All Axios ajax backend logic resides in the Vuex store organized in modules for each feature. Connections in the store are data agnostic. Components declare the connection by individual parameters. The store intercepter acts as a single point handler for "access token" and "refresh token" updates. It automatically retries on error and redirects to the login page when a refresh token expires or on none 401 errors.
  * Mixins for various components ( DRY ).
  * Route file.
- The demo was tested on large and medium screen sizes. Small updates are required for mobile use.

**Backend**:
  * API routes type, application interface.
  * Resource controllers with policy type security for model-driven data as recommended by Laravel.
  * Custom controller for TMDB connections. Middleware type security for none model-driven resources ( MovieController ).
  * Requests for server-side validation.
  * Resources for json responses (none TMDB data).
  * .env stored TMDB_TOKEN 
  * Laravel Passport Middleware as token-handler, security, and middleware (using Guzzle - as recommended by Laravel ).
  * User model with role-based management - relationship.
  * Frontend Vue mixin.
  * Mail templating ( password recovery etc ).
  
For full details, I suggest a full code review where I've included the necessary remarks!



