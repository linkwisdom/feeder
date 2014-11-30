require.config({
    baseUrl: './src',
    paths: {
        echarts: '../echarts'
    },
    waitSeconds: 3
});

require( [ 'main' ], function ( main ) {
        main.init();
});

