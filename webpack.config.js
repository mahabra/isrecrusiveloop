var path = require('path');
module.exports = {
    context: path.join(__dirname), // исходная директория
	entry: './index.js', // файл для сборки, если несколько - указываем hash (entry name => filename)
	output: {
		path: path.join(__dirname, 'dist'), // выходная директория
		filename: 'isrecrusiveloop.js',
		library: 'isrecrusiveloop',
		libraryTarget: 'umd'
	},
	plugins: [
		//new webpack.optimize.UglifyJsPlugin()
	],
	module: {
		loaders: [
	        { test: /\.css$/, loader: "style-loader!css-loader" },
	        { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
     		{ test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
	    ]
	}
};