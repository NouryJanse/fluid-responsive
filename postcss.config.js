module.exports = {
    plugins: [
        require('autoprefixer')({
            browsers: [
                '> 10% in NL',
                'last 2 versions',
                'ie >= 11'
            ],
            grid: true
        })
    ]
};