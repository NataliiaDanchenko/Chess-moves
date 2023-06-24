(function() { 

    const size = { w: 8, h: 8 };
    
    const maxSize = Math.max(size.w, size.h);

    const colors = ['antiquewhite', 'sand']; 

    const highlightClass = 'highlight'; 

    const figures = [ 
        {class: 'king', func: addKing},
        {class: 'knight', func: addKnight},
        {class: 'rook', func: addRook},
        {class: 'bishop', func: addBishop},
        {class: 'queen', func: addQueen},
        {class: 'black_pawn', func: addBlackPawn},
        {class: 'white_pawn', func: addWhitePawn}
    ];

    const chessBoard = document.querySelector('.chess_board'); 

    const squares = []; 

    for (let y = size.h - 1; y >= 0; y--) { 
        let rank = document.createElement('div');
        rank.classList.add('rank');
        chessBoard.append(rank);
        for(let x = 0; x < size.w; x++) { 
            let square = document.createElement('div'); 
            square.classList.add('chess_frame');
            rank.append(square);

            square.setAttribute('positionX', x); 
            square.setAttribute('positionY', y);

            square.classList.add(colors[x % 2 ^ y % 2]); 

            square.addEventListener('click', addFigures);

            mapSquare(square, x, y); 
        }
    }

    function mapSquare(square, x, y) { 
        if (!squares[y]) { 
            squares[y] = [];  
        }
        squares[y][x] = square; 
    }

    function addFigures () { 
        const figureIndex = getNextFigureIndex(this); 
        const figure = figures[figureIndex]; 
        clear();

        this.classList.add(figure.class); 
        this.setAttribute('data-figure', figureIndex); 

        const coords = { 
            x: parseInt(this.getAttribute('positionX')),
            y: parseInt(this.getAttribute('positionY'))
        };

        figure.func(coords) 
        
    }

    function addKing (coords) { 
        const moves = [ 
            {x: 0, y: 1}, 
            {x: 1, y: 1}
        ];

        highlightRotateMoves(coords, moves); 
    }

    function addKnight (coords) { 
        const moves = [
            {x: 1, y: 2},
            {x: -1, y: 2}
        ];
        highlightRotateMoves(coords, moves);
    }
    
    function addRook (coords) { 
        let moves = [];
            for(let i=1; i <= maxSize; i++){
            let a = {x: 0, y: i};
            moves.push(a);
       }
        highlightRotateMoves(coords, moves);
    }

    function addBishop (coords) { 
        let moves = [];
            for(let i=1; i <= maxSize; i++){
            let a = {x: i, y: i};
            moves.push(a);
        }
        highlightRotateMoves(coords, moves);
    }

    function addQueen (coords) { 
        let moves = [];
        for(let i=1; i <= maxSize; i++){
            let a = {x: 0, y: i};
            moves.push(a);
            let b = {x: i, y: i};
            moves.push(b);
        }
        highlightRotateMoves(coords, moves);
    }

     function addBlackPawn (coords) { 
        let moves = [
            {x: 0, y: 1} 
        ];
        
        if (coords.y === 1) {
            moves.push({x: 0, y: 2});
        }

        highlightMovesPawn(coords, moves); 
    }
    
    function addWhitePawn (coords) {
        let moves = [
            {x: 0, y: -1} 
        ];
        
        if (coords.y === size.h - 2) {
            moves.push({x: 0, y: -2});
        }

        highlightMovesPawn(coords, moves); 
    }

    function highlightRotateMoves(coords, moves) { 
        moves.forEach(m => {
            for(let i=0; i<4; i++){
                m = rotate(m);
                highlight (
                    coords.x + m.x,
                    coords.y + m.y
                )
            }
        });
    }

    function highlightMovesPawn (coords, moves) {
        moves.forEach(m => {
            highlight (
                coords.x + m.x,
                coords.y + m.y
            )
        })
    }

    function getNextFigureIndex(square) { 
        const value = square.getAttribute('data-figure'); 
        if(value === null) return 0; 
        let index = parseInt(value); 
        index = ++index % figures.length; 
        return index;
    }

    function rotate (p) { 
        return {
            x: p.y,
            y: -p.x
        }
    }

    function highlight(x, y) { 
        const targetRank = squares[y];
        if (!targetRank) {
            return;
        }
        
        const targetSquare = targetRank[x];
        if (!targetSquare) {
            return;
        }
        
        targetSquare.classList.add(highlightClass);
    }

    function clear() { 
        squares.forEach(rank => {
            rank.forEach(square => {
                const figure = square.getAttribute('data-figure');
                if(figure){
                    square.classList.remove(figures[figure].class); 
                    square.removeAttribute('data-figure'); 
                }
                square.classList.remove(highlightClass); 
            })
        })
    }
})()