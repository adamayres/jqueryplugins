# Ajax Cache Response jQuery Plugin

## Overview

The Ajax Cache Response plugin caches the response of Ajax requests.  Subsequent Ajax requests that match the original Ajax options will return the cached response instead of making a new call.  Cached responses can be stored in a HTML5 web storage allowing them to persist across a session.

## Why is this needed?

Typically Ajax requests are to made to URLs that provide dynamic content.  These requests are usually configured to have expires headers in the past (or in the very near future).  For most cases this is acceptable since we want to have fresh content.  However there is some content that does not need to super fresh and using the Ajax Cache Response could save a round trip request to the server (and additional overhead of recreating the response).

## More Info:

For examples and further doc please see the [wiki](https://github.com/adamayres/jqueryplugins/wiki/Ajax-Cache-Response-jQuery-Plugin).