(function (global) {
	let firstGeneration = [];
	let parentGeneration = [];
	let nextGeneration = [];


	class Life {
		constructor(dom) {
			const selectors = dom.selectors;
			const style = dom.style;

			this.fill = style.fill || 'F8BD28';
			this.stroke = style.stroke || '8LBD18';

			this.canvas = document.getElementById(selectors.canvas || 'universe');
			this.startBtn = document.getElementsByClassName(selectors.start || 'startButton')[0];
			this.quickerBtn = document.getElementsByClassName(selectors.quicker || 'quicker')[0];
			this.slowerBtn = document.getElementsByClassName(selectors.slower || 'slower')[0];
			this.stopBtn = document.getElementsByClassName(selectors.stop || 'stopButton')[0];

			this.intervalId = null;
			this.speed = 1500;
		}

		run() {
			this.createFirstGeneration();
			this.start();
		}

		//Fill the Universe by alive and empty(dead) planets
		createFirstGeneration() {
			for(var i = 0; i < 200; i++){
				firstGeneration[i] = [];
				for (var j = 0; j < 200; j++){
					firstGeneration[i][j] = Math.round(Math.abs(Math.random() - 0.42));
				}
			}
			nextGeneration = firstGeneration;
		}

		//ability to add or remove any planet from the Universe
		togglePlanets(e) {
			const pos = $("#universe").position();
			const ox = e.pageX - pos.left;
			const oy = e.pageY - pos.top;
			const yField = Math.floor(oy / 5);
			const xField = Math.floor(ox / 5);

			firstGeneration[yField][xField] = firstGeneration[yField][xField] == "1" ? "0" : "1";
			this.repaintPanel();
		}

		//set speed of development of the Universe
		setSpeed(interval, e) {
			const type = e.target.dataset.type ? e.target.dataset.type : null;
			const cb = () => this.startLife();

			if (type === 'increment') {
				this.speed = this.speed + interval;
			} else if (type === 'decrement') {
				this.speed = this.speed - interval;
			}

			clearInterval(this.intervalId);
			this.intervalId = setInterval(cb, this.speed);
		}

		//stop development of the Universe
		stopSpeed() {
			clearInterval(this.intervalId);
		}

		//start development of the Universe
		start() {
			this.canvas.addEventListener('click', this.togglePlanets.bind(this), false);
			this.startBtn.addEventListener('click', this.setSpeed.bind(this, this.speed), false);
			this.quickerBtn.addEventListener('click', this.setSpeed.bind(this, 250), false);
			this.slowerBtn.addEventListener('click', this.setSpeed.bind(this, 250), false);
			this.stopBtn.addEventListener('click', this.stopSpeed.bind(this), false);
			this.repaintPanel();
		}

		//the cycle of the Universe (one tick)
		startLife(){
			//figure out of the current status of the planet (is he alive, dead or beyond the border)
			function findCell(i, j){
				if (i < 0 || i >= 200 || j < 0 || j >= 200){
					return 0;
				} else {
					return +parentGeneration[i][j];
				}
			}

			//calculate the status of the planet for next generation
			function newGenerationCreate(i, j){
				let currentCell = findCell(i, j);
				let newCell = 0;
				let neighbors = ( findCell(i-1, j-1) + findCell(i-1, j) + findCell(i-1, j+1)
										+ findCell(i, j-1) + findCell(i, j+1) +findCell(i+1, j-1)
										+ findCell(i+1, j) + findCell(i+1, j+1));
					if ( currentCell ){
						if (neighbors > 1 && neighbors < 4){
							newCell = 1;
						}
					} else {
						if (neighbors == 3){
							newCell = 1;
						}
					}
					nextGeneration[i][j] = newCell;
			}

			//calculate the status of each planet for next generation
			// parentGeneration = JSON.parse(JSON.stringify(nextGeneration))
			parentGeneration = nextGeneration;
			for (let i = 0; i<nextGeneration.length; i++ ){
				for (let j = 0; j<nextGeneration[i].length; j++ ){
						newGenerationCreate(i, j);
				}
			}
			this.repaintPanel();
		}

		//paint alive and dead planet
		repaintPanel() {
			const canvas = this.canvas;
			this.clear();

			const ctx = canvas.getContext("2d");

			for(var i = 0; i < nextGeneration.length; i++) {
				for (var j = 0; j < nextGeneration[i].length; j++) {
					ctx.lineWidth = 2;
					ctx.strokeStyle = this.stroke;
					ctx.beginPath();
					ctx.rect(j * 5, i * 5, 5, 5);
					ctx.stroke();

					if(nextGeneration[i][j] == "1") {
						ctx.fillStyle = this.fill;
						ctx.beginPath();
						ctx.rect(j * 5, i * 5, 5, 5);
						ctx.fill();
					}
				}
			}
		}

		clear() {
			const canvas = this.canvas;
			const ctx = canvas.getContext('2d');
			ctx.clearRect(0, 0, 1000, 1000);
		}
	}

	global.life = new Life({
		selectors: {
			canvas: 'universe',
			start:'startButton',
			quicker: 'quicker',
			slower: 'slower',
			stop: 'stopButton',
		},
		style: {
			stroke: '#8LBD18',
			fill: '#F8BD28',
		}
	});

})(window);

life.run();
