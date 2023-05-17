//https://en.wikipedia.org/wiki/Unicode_block

function toArray(first, last) {
	return Array.from({ length: last - first + 1 }, (e, i) => i + first);
}

export const blocks = [
	{
		name: 'Alchemical Symbols',
		codes: toArray(0x1f700, 0x1f773),
	},
	{
		name: 'Arrows',
		codes: toArray(0x2190, 0x21ff),
	},
	{
		name: 'Dingbats',
		codes: toArray(0x2701, 0x27bf),
	},
	{
		name: 'Domino Tiles',
		codes: toArray(0x1f030, 0x1f093),
	},
	{
		name: 'Emoticons',
		codes: toArray(0x1f600, 0x1f64f),
	},
	{
		name: 'Geometric Shapes',
		codes: toArray(0x25a0, 0x25ff),
	},
	{
		name: 'Miscellaneous Symbols',
		codes: toArray(0x2600, 0x26ff),
	},
	{
		name: 'Miscellaneous Symbols and Arrows',
		codes: [...toArray(0x2b00, 0x2b4c), ...toArray(0x2b50, 0x2b59)],
	},
	{
		name: 'Miscellaneous Symbols and Pictographs',
		codes: [
			...toArray(0x1f300, 0x1f321),
			...toArray(0x1f324, 0x1f393),
			...toArray(0x1f396, 0x1f397),
			...toArray(0x1f399, 0x1f39b),
			...toArray(0x1f39e, 0x1f3f0),
			...toArray(0x1f3f3, 0x1f3f5),
			...toArray(0x1f3f7, 0x1f53b),
			...toArray(0x1f549, 0x1f54e),
			...toArray(0x1f550, 0x1f567),
			...toArray(0x1f56f, 0x1f570),
			...toArray(0x1f573, 0x1f57a),
			...toArray(0x1f587, 0x1f587),
			...toArray(0x1f58a, 0x1f58d),
			...toArray(0x1f590, 0x1f590),
			...toArray(0x1f595, 0x1f596),
			...toArray(0x1f5a4, 0x1f5a5),
			...toArray(0x1f5a8, 0x1f5a8),
			...toArray(0x1f5b1, 0x1f5b2),
			...toArray(0x1f5bc, 0x1f5bc),
			...toArray(0x1f5c2, 0x1f5c4),
			...toArray(0x1f5d1, 0x1f5d3),
			...toArray(0x1f5dc, 0x1f5de),
			...toArray(0x1f5e1, 0x1f5e1),
			...toArray(0x1f5e3, 0x1f5e3),
			...toArray(0x1f5e8, 0x1f5e8),
			...toArray(0x1f5ef, 0x1f5ef),
			...toArray(0x1f5f3, 0x1f5f3),
			...toArray(0x1f5fa, 0x1f5ff),
		],
	},
	{
		name: 'Miscellaneous Technical',
		codes: toArray(0x2300, 0x23ff),
	},
	{
		name: 'Playing Cards',
		codes: toArray(0x2660, 0x2667),
	},
	{
		name: 'Supplemental Symbols and Pictographs',
		codes: [...toArray(0x1f90c, 0x1f93a), ...toArray(0x1f93c, 0x1f9ff)],
	},
	{
		name: 'Symbols and Pictographs Extended-A',
		codes: [
			...toArray(0x1fa70, 0x1fa74),
			...toArray(0x1fa78, 0x1fa7c),
			...toArray(0x1fa80, 0x1fa86),
			...toArray(0x1fa90, 0x1faac),
			...toArray(0x1fab0, 0x1faba),
			...toArray(0x1fac0, 0x1fac5),
			...toArray(0x1fad0, 0x1fad9),
			...toArray(0x1fae0, 0x1fae7),
			...toArray(0x1faf0, 0x1faf6),
		],
	},
	{
		name: 'Transport and Map Symbols',
		codes: [
			...toArray(0x1f680, 0x1f6c5),
			...toArray(0x1f6cb, 0x1f6d2),
			...toArray(0x1f6d5, 0x1f6d7),
			...toArray(0x1f6dd, 0x1f6e5),
			...toArray(0x1f6e9, 0x1f6e9),
			...toArray(0x1f6eb, 0x1f6ec),
			...toArray(0x1f6f0, 0x1f6f0),
			...toArray(0x1f6f3, 0x1f6fc),
		],
	},
	{
		name: 'Yijing Hexagram Symbols',
		codes: toArray(0x4dc0, 0x4dff),
	},
];
