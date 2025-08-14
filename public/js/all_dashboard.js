let tictactoe_component=(a,o,l)=>{{var r=a,i=o,n=["","","","","","","","",""];if(0<r.move_data?.length)for(var d=0;d<r.move_data.length;++d){var c=r.move_data[d];n[c.pos]=c.piece}var p=document.querySelector("div#game_board");if(!p)throw"Unable to find board element for tic tac toe";for(;p.firstChild;)p.removeChild(p.firstChild);"finished"==r.status&&(a=[`
                <span>This game has finished. Winner: ${r.result}</span>
                <br />`],p.appendChild(parseTemplate(a)));let e=[`
            <div id="tictactoe">
                <h1>
                    Tic Tac Toe!
                </h1>

                <br />

                <table id="tictactoe_board">
                    <tr>
                        <td>${n[0]}</td>
                        <td>${n[1]}</td>
                        <td>${n[2]}</td>
                    </tr>
                    <tr>
                        <td>${n[3]}</td>
                        <td>${n[4]}</td>
                        <td>${n[5]}</td>
                    </tr>
                    <tr>
                        <td>${n[6]}</td>
                        <td>${n[7]}</td>
                        <td>${n[8]}</td>
                    </tr>
                </table>
            </div>
            <br />
        `],s=(p.appendChild(parseTemplate(e)),document.querySelectorAll("table#tictactoe_board tr td"));if(9!=s.length)throw"Unable to find all nine TDs for the the tictactoe board";let t="individual"==r.status?"X":"O";if("finished"!==r.status&&!i)for(d=0;d<n.length;++d)if(!n[d]&&!i){let o=d;s[d].addEventListener("click",()=>{var e,a;e=o,a=t,n[e]||(s[e].innerHTML=t,n[e]=t,e=generateWSPacket({action:"move",game_id:r.id,moveData:{pos:e,piece:a}}),ws.send(e),"function"==typeof l&&l())}),s[d].style.cursor="pointer"}}};function checkerBoard(l,e,a){this.generateEmptyBoard=()=>{for(var e=[],a=0;a<8;++a)e.push([null,null,null,null,null,null,null,null]);return e[0][0]={king:!1,color:"W"},e[0][2]={king:!1,color:"W"},e[0][4]={king:!1,color:"W"},e[0][6]={king:!1,color:"W"},e[1][1]={king:!1,color:"W"},e[1][3]={king:!1,color:"W"},e[1][5]={king:!1,color:"W"},e[1][7]={king:!1,color:"W"},e[2][0]={king:!1,color:"W"},e[2][2]={king:!1,color:"W"},e[2][4]={king:!1,color:"W"},e[2][6]={king:!1,color:"W"},e[5][1]={king:!1,color:"B"},e[5][3]={king:!1,color:"B"},e[5][5]={king:!1,color:"B"},e[5][7]={king:!1,color:"B"},e[6][0]={king:!1,color:"B"},e[6][2]={king:!1,color:"B"},e[6][4]={king:!1,color:"B"},e[6][6]={king:!1,color:"B"},e[7][1]={king:!1,color:"B"},e[7][3]={king:!1,color:"B"},e[7][5]={king:!1,color:"B"},e[7][7]={king:!1,color:"B"},e},this.game=l,this.container=e,this.onMoveComplete=a,this.current_move=0,this.board=this.generateEmptyBoard();var o="";if("finished"==l.status&&(o=`<h3>This game has finished. Winner: ${l.result}</h3>`),this.renderBoardDOM=()=>{var e=[`
            <div id="checkers">
                <h1>
                    Checkers!
                </h1>                
                <br />

                ${o}

                <div id="checker_board">
                    <span class="board_row">
                        <span class="board_cell" id="board_cell_0x0"></span>
                        <span class="board_cell" id="board_cell_0x1"></span>
                        <span class="board_cell" id="board_cell_0x2"></span>
                        <span class="board_cell" id="board_cell_0x3"></span>
                        <span class="board_cell" id="board_cell_0x4"></span>
                        <span class="board_cell" id="board_cell_0x5"></span>
                        <span class="board_cell" id="board_cell_0x6"></span>
                        <span class="board_cell" id="board_cell_0x7"></span>
                    </span>
                    <span class="board_row">
                        <span class="board_cell" id="board_cell_1x0"></span>
                        <span class="board_cell" id="board_cell_1x1"></span>
                        <span class="board_cell" id="board_cell_1x2"></span>
                        <span class="board_cell" id="board_cell_1x3"></span>
                        <span class="board_cell" id="board_cell_1x4"></span>
                        <span class="board_cell" id="board_cell_1x5"></span>
                        <span class="board_cell" id="board_cell_1x6"></span>
                        <span class="board_cell" id="board_cell_1x7"></span>
                    </span>
                    <span class="board_row">
                        <span class="board_cell" id="board_cell_2x0"></span>
                        <span class="board_cell" id="board_cell_2x1"></span>
                        <span class="board_cell" id="board_cell_2x2"></span>
                        <span class="board_cell" id="board_cell_2x3"></span>
                        <span class="board_cell" id="board_cell_2x4"></span>
                        <span class="board_cell" id="board_cell_2x5"></span>
                        <span class="board_cell" id="board_cell_2x6"></span>
                        <span class="board_cell" id="board_cell_2x7"></span>
                    </span>
                    <span class="board_row">
                        <span class="board_cell" id="board_cell_3x0"></span>
                        <span class="board_cell" id="board_cell_3x1"></span>
                        <span class="board_cell" id="board_cell_3x2"></span>
                        <span class="board_cell" id="board_cell_3x3"></span>
                        <span class="board_cell" id="board_cell_3x4"></span>
                        <span class="board_cell" id="board_cell_3x5"></span>
                        <span class="board_cell" id="board_cell_3x6"></span>
                        <span class="board_cell" id="board_cell_3x7"></span>
                    </span>
                    <span class="board_row">
                        <span class="board_cell" id="board_cell_4x0"></span>
                        <span class="board_cell" id="board_cell_4x1"></span>
                        <span class="board_cell" id="board_cell_4x2"></span>
                        <span class="board_cell" id="board_cell_4x3"></span>
                        <span class="board_cell" id="board_cell_4x4"></span>
                        <span class="board_cell" id="board_cell_4x5"></span>
                        <span class="board_cell" id="board_cell_4x6"></span>
                        <span class="board_cell" id="board_cell_4x7"></span>
                    </span>
                    <span class="board_row">
                        <span class="board_cell" id="board_cell_5x0"></span>
                        <span class="board_cell" id="board_cell_5x1"></span>
                        <span class="board_cell" id="board_cell_5x2"></span>
                        <span class="board_cell" id="board_cell_5x3"></span>
                        <span class="board_cell" id="board_cell_5x4"></span>
                        <span class="board_cell" id="board_cell_5x5"></span>
                        <span class="board_cell" id="board_cell_5x6"></span>
                        <span class="board_cell" id="board_cell_5x7"></span>
                    </span>
                    <span class="board_row">
                        <span class="board_cell" id="board_cell_6x0"></span>
                        <span class="board_cell" id="board_cell_6x1"></span>
                        <span class="board_cell" id="board_cell_6x2"></span>
                        <span class="board_cell" id="board_cell_6x3"></span>
                        <span class="board_cell" id="board_cell_6x4"></span>
                        <span class="board_cell" id="board_cell_6x5"></span>
                        <span class="board_cell" id="board_cell_6x6"></span>
                        <span class="board_cell" id="board_cell_6x7"></span>
                    </span>
                    <span class="board_row">
                        <span class="board_cell" id="board_cell_7x0"></span>
                        <span class="board_cell" id="board_cell_7x1"></span>
                        <span class="board_cell" id="board_cell_7x2"></span>
                        <span class="board_cell" id="board_cell_7x3"></span>
                        <span class="board_cell" id="board_cell_7x4"></span>
                        <span class="board_cell" id="board_cell_7x5"></span>
                        <span class="board_cell" id="board_cell_7x6"></span>
                        <span class="board_cell" id="board_cell_7x7"></span>
                    </span>                    
                </div>
                <div id="game_controls">
                    <button class="first" title="First Move">First</button>
                    <button class="prev" title="Previous Move"><< Prev</button>
                    <button class="next" title="Next Move">Next >></button>
                    <button class="last" title="Last Move">Last</button>
                </div>
            </div>
            <br />
        `];this.container.appendChild(parseTemplate(e))},this.renderPieces=()=>{document.querySelectorAll("span.piece").forEach(e=>{e.classList.remove("piece")}),document.querySelectorAll("span.king").forEach(e=>{e.classList.remove("king")}),document.querySelectorAll("span.piece_B").forEach(e=>{e.classList.remove("piece_B")}),document.querySelectorAll("span.piece_W").forEach(e=>{e.classList.remove("piece_W")});for(let a=0;a<8;++a)for(let e=0;e<8;++e){var o=document.querySelector(`#board_cell_${a}x`+e);o&&(o.onclick=null,o.innerHTML=null)}for(var s=0;s<8;s++)for(var t=0;t<8;t++)if(null!==this.board[s][t]){let a=document.querySelector(`#board_cell_${s}x`+t);if(a){a.classList.add("piece_"+this.board[s][t].color),a.classList.add("piece"),this.board[s][t].king&&a.classList.add("king");let e={x:s,y:t};"finished"!=this.game.status&&this.current_move==this.game.move_data?.length&&("individual"==l.status&&"B"==this.board[s][t].color||"collective"==l.status&&"W"==this.board[s][t].color&&userDetails.user_id!=l.owner_id)&&(a.onclick=()=>this.pieceClick(a,e),a.classList.add("clickable"))}}},this.cleanBoardDom=()=>{var e=this.container.querySelectorAll("span.active"),e=(0<e.length&&e.forEach(e=>{e.classList.remove("active")}),this.container.querySelectorAll("span.move_target"));0<e.length&&e.forEach(e=>{e.classList.remove("move_target","clickable"),e.onclick=null})},this.pieceClick=(e,s)=>{this.cleanBoardDom(),e.classList.add("active"),this.findPotentialMoves(s).forEach(a=>{var o=document.querySelector(`#board_cell_${a.x}x`+a.y);if(o){let e=a.captures||[];o.onclick=()=>{this.executeMove(s,a,e),this.renderPieces()},o.classList.add("move_target")}})},this.findPotentialMoves=(a,o,s)=>{if(!a||void 0===a.x||(a.y,0)||a.x<0||7<a.x||a.y<0||7<a.y)return[];s=s||[];var t=this.board[a.x][a.y],e=[{x:1,y:1},{x:1,y:-1},{x:-1,y:1},{x:-1,y:-1}];let l=[];t.king?l=e:("B"==t.color&&(l.push(e[2]),l.push(e[3])),"W"==t.color&&(l.push(e[0]),l.push(e[1])));var r=[];for(let e=0;e<l.length;++e){var i=s.slice(0),n=l[e],d=a.x+n.x,c=a.y+n.y,p=(o||!this.board[d]||this.board[d][c]||r.push({x:d,y:c}),d+n.x),n=c+n.y;0<=p&&p<8&&0<=n&&n<8&&this.board[d]&&this.board[d][c]&&this.board[d][c].color!=t.color&&this.board[p]&&!this.board[p][n]&&(i.push({x:d,y:c}),r.push({x:p,y:n,captures:i.slice(0)}),d=this.board[p][n],this.board[p][n]=t,r.push(...this.findPotentialMoves({x:p,y:n},!0,i.slice(0))),this.board[p][n]=d)}return r},this.replayMove=(e,a,o)=>{var s=this.board[a.x][a.y]=this.board[e.x][e.y];this.board[e.x][e.y]=null,"W"==s.color&&7==a.x&&(s.king=!0),"B"==s.color&&0==a.x&&(s.king=!0);for(let e=0;e<o.length;++e)this.board[o[e].x][o[e].y]=null},this.executeMove=(e,a,o)=>{var s=generateWSPacket({action:"move",game_id:this.game.id,moveData:{from:{x:e.x,y:e.y},to:{x:a.x,y:a.y},captures:o}}),s=(ws.send(s),this.cleanBoardDom(),this.board[a.x][a.y]=this.board[e.x][e.y]);this.board[e.x][e.y]=null,"W"==s.color&&7==a.x&&(s.king=!0),"B"==s.color&&0==a.x&&(s.king=!0);for(let e=0;e<o.length;++e)this.board[o[e].x][o[e].y]=null;"function"==typeof this.onMoveComplete&&(this.current_move++,this.onMoveComplete()),this.renderPieces()},this.stepFirstMove=()=>{0<this.current_move&&(this.current_move=0),this.cleanBoardDom(),this.board=this.generateEmptyBoard();var e=l.move_data[0];this.replayMove(e.from,e.to,e.captures),this.renderPieces()},this.stepNextMove=()=>{this.game.move_data&&this.current_move<this.game.move_data.length&&this.current_move++,this.cleanBoardDom(),this.board=this.generateEmptyBoard();for(let e=0;e<this.current_move;++e){var a=l.move_data[e];this.replayMove(a.from,a.to,a.captures)}this.renderPieces()},this.stepPreviousMove=()=>{0<this.current_move&&this.current_move--,this.cleanBoardDom(),this.board=this.generateEmptyBoard();for(let e=0;e<this.current_move;++e){var a=l.move_data[e];this.replayMove(a.from,a.to,a.captures)}this.renderPieces()},this.stepLastMove=()=>{this.current_move!=this.game.move_data.length&&(this.current_move=this.game.move_data.length),this.cleanBoardDom(),this.board=this.generateEmptyBoard();for(let e=0;e<this.current_move;++e){var a=l.move_data[e];this.replayMove(a.from,a.to,a.captures)}this.renderPieces()},this.renderBoardDOM(),this.cleanBoardDom(),this.current_move=this.game.move_data?.length,l.move_data&&l.move_data.length)for(let e=0;e<l.move_data.length;++e){var s=l.move_data[e];this.replayMove(s.from,s.to,s.captures)}this.renderPieces(),document.querySelector("div#game_controls button.first").onclick=this.stepFirstMove,document.querySelector("div#game_controls button.next").onclick=this.stepNextMove,document.querySelector("div#game_controls button.prev").onclick=this.stepPreviousMove,document.querySelector("div#game_controls button.last").onclick=this.stepLastMove}let checkers_component=(e,a,o)=>{var s=document.querySelector("div#game_board");if(!s)throw"Unable to find board element for checkers";for(;s.firstChild;)s.removeChild(s.firstChild);new checkerBoard(e,s,o)},Home=()=>{var e=[`
        <div id="home">
            <h2>
                Welcome to your dashboard! 
            </h2>
            <p>This is where you can play against (or as one of) the collective.</p>
            <ul>
                <li>
                    <a href="javascript:showCreateGameModal();">Challenge</a>: 
                    Create your own game and make the opening move! Create as many as you want!
                </li>
                <li>
                    <a href="/dashboard#/play">Join</a>: Join the queue to make the
                    next move as a member of the collective in an anonymous game!
                </li>
                <li>
                    Moves made in collective games: ${userDetails.num_collective_moves}
                </li>
                <li>
                    Individual victories: ${userDetails.num_individual_victories}
                </li>
                <li>
                    Individual Defeats: ${userDetails.num_individual_defeats}
                </li>
            </ul>
        </div>
    `];return parseTemplate(e)},Game=e=>parseTemplate([`
        <div id="game_board">
            <marquee>Loading...</marquee>
        </div>
    `]),Play=a=>{let o="";if(0==o.length)for(let e=0;e<a.collectiveQueues.length;++e)o+=`<option value="${a.collectiveQueues[e].id}">
                            ${a.collectiveQueues[e].name}
                        </option>`;var e="<p>When someone creates a Challenge, that challenge is passed to us after the creator (the individual) makes each of their moves.  It's your job now to make those opposing moves!</p>",e=((e+="<br />")+"<p>You can exit the queue at any time if you need a break, or if you want switch to a different game type, but you must make a move each time you are given the opportunity to.</p>"+"<br />"+"<p>You will not be given the option to make a move in a game that you started nor will you be shown who started a game.  The individual that started the game will not be shown who made each move.</p>"+"<br />"+"<p>Need something to do while you wait, join the collective and make a few moves, do your part to keep the queues clear</p>"+"<br />",[`
        <div id="game_board">
            <h1>Welcome to the collective!</h1>
            <br />
            <h2>Choose a game type and join the fun!</h2>
            <br />

            <select id="collective_queue" name="queue">
                ${o}
            </select>
            <button onClick="joinQueue()">Join</button>
            <br /><br />

            <p>When someone creates a Challenge, that challenge is passed to us after the creator (the individual) makes each of their moves.  It's your job now to make those opposing moves!</p><br /><p>You can exit the queue at any time if you need a break, or if you want switch to a different game type, but you must make a move each time you are given the opportunity to.</p><br /><p>You will not be given the option to make a move in a game that you started nor will you be shown who started a game.  The individual that started the game will not be shown who made each move.</p><br /><p>Need something to do while you wait, join the collective and make a few moves, do your part to keep the queues clear</p><br />
        </div>
    `]);return parseTemplate(e)},gameJSLoad=()=>{var t,e,l=!1;(t=0<location.hash.length&&((e=location.hash.split("/"))[1],e[2])&&!isNaN(e[2])?e[2]:t)?($.get("/game/"+t).then(e=>{l=e,gameComponentMap[l.game_type]&&(e="collective"==l.status,gameComponentMap[l.game_type](l,e,()=>{}))}),ws.onmessage=e=>{console.log("websocket message received in js/game.js, msg = ",e);let a;if(e.data)if("string"==typeof e.data)try{a=JSON.parse(e.data)}catch(e){return}else a=e.data;let o=document.querySelector("div#game_board");switch(a.action){case"play":$.get("/game/"+a.game_id).then(e=>{showGame(o,e)});break;case"update":a.game&&a.game.id&&a.game.id==t&&(l=a.game,gameComponentMap[a.game.game_type])&&(s="collective"==a.game.status,gameComponentMap[a.game.game_type](a.game,s,()=>{}));var s=document.querySelector("li.game_"+a.game.id);s.classList.remove("collective_turn","individual_turn"),"finished"!==a.game.status?s.classList.add(a.game.status+"_turn"):s.classList.add("finished");break;case"toast":showToast(a.msg)}}):alert("No Game Id found")};var playArea;let collChime=new Audio("/audio/collective_chime.mp3"),playJSLoad=async()=>{ws.onmessage=e=>{let a;if(e.data)if("string"==typeof e.data)try{a=JSON.parse(e.data)}catch(e){return}else a=e.data;switch(playArea=document.querySelector("div#game_board"),a.action){case"play":$.get("/game/"+a.game_id).then(e=>{showGame(playArea,e),userDetails?.sound&&collChime.play()});break;case"toast":showToast(a.msg);break;default:showLoading(playArea)}}};function joinQueue(){var e=document.querySelector("select#collective_queue").value,e=generateWSPacket({action:"join",queue_id:e}),e=(ws.send(e),document.querySelector("div#game_board"));showLoading(e),document.querySelector("a#join_queue").style.display="none",document.querySelector("a#exit_queue").style.display="block"}function exitQueue(){var e=generateWSPacket({action:"exit"});ws.send(e),document.querySelector("a#exit_queue").style.display="none",document.querySelector("a#join_queue").style.display="block",playArea&&showLoading(playArea)}function showGame(e,a){for(;e.firstChild;)e.removeChild(e.firstChild);gameComponentMap[a.game_type](a,!1,()=>{setTimeout(()=>{showLoading(e)},1500)})}function showLoading(e){for(;e.firstChild;)e.removeChild(e.firstChild);var a=document.createElement("div");a.className="queued",a.innerHTML=`<span>Looking for available game</span>
                            <br />
                            <a href="/dashboard">Leave Queue</a>`,e.appendChild(a)}let DashboardRoutes={"/home":Home,"/game":Game,"/play":Play},DashboardOnLoads={"/game":gameJSLoad,"/play":playJSLoad};var collectiveQueues=!1,ws=!1;let websocket_url="wss://playagainstthe.com:8081",gameComponentMap={1:tictactoe_component,2:checkers_component},dashboardLoad=e=>{ws||(console.log("Creating WS in js/dashboard.js"),ws=new WebSocket(websocket_url)),collectiveQueues||$.get("/collective_queue",e=>{collectiveQueues=e,a()});let a=()=>{let e="/home",a=!1;0<location.hash.length&&(o=location.hash.split("/"),e="/"+o[1]||"/home",a=!1,o[2])&&!isNaN(o[2])&&(a=o[2]);for(var o={gameTypes:gameTypes,game_id:a,collectiveQueues:collectiveQueues},s=DashboardRoutes[e],t=document.getElementById("dashboard_container");t.firstChild;)t.removeChild(t.firstChild);s?t.appendChild(s(o)):t.textContent="404 - Page not found",DashboardOnLoads[e]&&DashboardOnLoads[e](),refreshGameMenu()};window.addEventListener("hashchange",a),window.addEventListener("DOMContentLoaded",a)};window.addEventListener?window.addEventListener("load",dashboardLoad,!1):window.attachEvent&&window.attachEvent("onload",dashboardLoad);