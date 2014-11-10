// Order for javascript components to be loaded

/*



    /////////////////////////////////////////////////////
    //                    CDN LINKS                    //
    /////////////////////////////////////////////////////

    jquery-2.1.1.min.js   // Load from Google CDN with local fallback
    bootstrap.min.js      // Load from Bootstrap CDN



    /////////////////////////////////////////////////////
    //          CONCAT & MINIFY INTO ONE FILE          //
    /////////////////////////////////////////////////////

    _console-error-fix.js // Goes first to prevent console errors in older browsers
    _custom.js            // Any custom JS components go here
    _crossbrowser.js      // Can go near the end.
    _flying-focus.js      // Should always be last since it stops all JS after it from running in IE8 for some reason.



*/