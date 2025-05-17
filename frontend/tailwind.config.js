module.exports = {
	theme: {
		extend: {
			// colors: {
			// 	'text': '#D7D9C9',
			// 	'background': '#1E1E1E',
			// 	'primary': '#303631',
			// 	'secondary': '#75846c',
			// 	'accent': '#702F2F',
			// 	'accent2': '#9D4141'
			// },
			// colors: { // pastel purple palette
			// 	'text': '#e9e5eb',
			// 	'background': '#161117',
			// 	'primary': '#c2afca',
			// 	'secondary': '#573d61',
			// 	'accent': '#a572ac',
			// },
			colors: { // similar green palette
				'text': '#eaecea',
				'background': '#0b0d0b',
				'primary': '#b0c0b4',
				'secondary': '#48614e',
				'tertiary': '#131613',
				'accent': '#77a282',
                                "stock-positive": "#4d7d2d",
                                "stock-negative": "#691919",
				'accent2': '#9D4141'
			},
			fontFamily: {
				text: ['"JetBrains Mono"', 'monospace'],
				heading: ['"Rubik Mono One"', 'sans-serif'],
                                sans: ['Inter', 'sans-serif'], // Inter = default sans font
			},
		},
	},
	plugins: [],
};
