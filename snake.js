// Variables globales
var velocidad = 100;
var tamano = 10;
var puntos = 0;
let loop = null;
let ultimoNivel = 0;  // ← nueva variable global
let nombreJugador = ""; // Variable global

function iniciarJuego() {
    const input = document.getElementById("nombreJugador");
    nombreJugador = input.value.trim() || "Jugador";

    // Ocultar popup
    document.getElementById("instrucciones").style.display = "none";

    // Iniciar el juego
    loop = setInterval(main, velocidad);
}




class objeto {
    constructor(){
        this.tamano = tamano;
    }

    choque(obj){
        var difx = Math.abs(this.x - obj.x);
        var dify = Math.abs(this.y - obj.y);

        if(difx >= 0 && difx < tamano && dify >= 0 && dify < tamano){
            return true;
        }
        return false;
    }
}

//Direccion de la cabeza
var xdir = 0;
var ydir = 0;


class Cola extends objeto {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.siguiente = null;
    }

    dibujar(contexto, index = 0) {
    if (this.siguiente != null) {
        this.siguiente.dibujar(contexto, index + 1);
    }

    // Cambiar color según la posición del segmento
    let hue = (index * 30) % 360; // cada 30° da un color distinto
    contexto.fillStyle = `hsl(${hue}, 100%, 50%)`;
    if (index === 0) {
    contexto.save(); // Guarda el estado del canvas

    // Mover el origen al centro de la cabeza
    contexto.translate(this.x + this.tamano / 2, this.y + this.tamano / 2);

    // Determinar el ángulo según dirección
    let angulo = 0;
    if (xdir === tamano) angulo = 90;        // derecha
    else if (xdir === -tamano) angulo = 270; // izquierda
    else if (ydir === tamano) angulo = 180;  // abajo
    else if (ydir === -tamano) angulo = 0;   // arriba

    contexto.rotate((angulo * Math.PI) / 180);

    // Dibujar el triángulo apuntando hacia arriba (luego se rota)
    contexto.beginPath();
    contexto.moveTo(0, -this.tamano / 2);  // punta
    contexto.lineTo(-this.tamano / 2, this.tamano / 2);
    contexto.lineTo(this.tamano / 2, this.tamano / 2);
    contexto.closePath();
    contexto.fill();

    contexto.restore(); // Restaurar el canvas
    } else {
        contexto.fillRect(this.x,this.y,this.tamano,this.tamano);
    }

}



    setxy(x, y){
        if(this.siguiente != null){
            this.siguiente.setxy(this.x, this.y);
        }
        this.x = x;
        this.y = y;
    }

    meter(){
        if(this.siguiente == null){
            this.siguiente = new Cola(this.x, this.y);
        }
        else{
            this.siguiente.meter();
        }
    }

    getSiguiente(){
        return this.siguiente;
    }
    getLength(){
    let count = 1;
    let temp = this.siguiente;
    while (temp != null){
        count++;
        temp = temp.getSiguiente();  // Asegúrate que el método se llame igual
    }
    return count;
}

    
   
}

class Comida extends objeto {
    constructor(){
        super();
        this.x = this.generar();
        this.y = this.generar();
    }
    generar() {
    let minBloquesY = 4; // Para evitar zona del marcador (40px / tamano)
    let filas = 60 - minBloquesY; // 600px / 10px = 60 filas - 4 = 56
    let num = (Math.floor(Math.random() * filas) + minBloquesY) * tamano;
    return num;
}
    colocar(){
        this.x = this.generar();
        this.y = this.generar();
    }
    dibujar(contexto){
        contexto.fillStyle = "#FF0000";
        contexto.fillRect(this.x, this.y, this.tamano, this.tamano);
    }
}

class Obstaculo extends objeto {
    constructor() {
        super();
        this.x = this.generar();
        this.y = this.generar();
    }
    generar() {
    let minBloquesY = 4; // Para evitar zona del marcador (40px / tamano)
    let filas = 60 - minBloquesY; // 600px / 10px = 60 filas - 4 = 56
    let num = (Math.floor(Math.random() * filas) + minBloquesY) * tamano;
    return num;
}
    dibujar(contexto) {
        contexto.fillStyle = "#C75D2C";
        contexto.fillRect(this.x, this.y, this.tamano, this.tamano);
    }
}

var obstaculos = [new Obstaculo()];



// Objetos del juego
var cabeza =  new Cola(20,60);
var comida = new Comida();
var ejex = true;
var ejey = true;
var xdir = 0;
var ydir = 0;

function movimiento() {
    var nx = cabeza.x + xdir;
    var ny = cabeza.y + ydir;
    cabeza.setxy(nx, ny);
}

function control(event) {
    var cod = event.keyCode;
    if(ejex){
        if(cod == 38){
            ydir -= tamano;
            xdir = 0;
            ejex = false;
            ejey = true;
        }
        if(cod == 40){
            ydir += tamano;
            xdir = 0;
            ejex = false;
            ejey = true;
        }
    }
    if(ejey){
        if(cod == 37){
            ydir = 0;
            xdir -= tamano;
            ejex = true;
            ejey = false;
        }
        if(cod == 39){
            ydir = 0;
            xdir += tamano;
            ejex = true;
            ejey = false;
        }
    }
}

function gameover(){

    clearInterval(loop); // Detener bucle actual

    const puntajeFinal = puntos; // ← Guarda el puntaje ANTES de reiniciarlo

    // Reiniciar variables
    puntos = 0;
    velocidad = 100;
    xdir = 0;
    ydir = 0;
    ejex = true;
    ejey = true;
    cabeza = new Cola(20, 60);
    comida = new Comida();
    obstaculos = [new Obstaculo()];
    ultimoNivel = 0;
    alert("Lo Siento Perdiste :( \nPuntaje: " + puntajeFinal); // ← Muestra el puntaje final

    // Reiniciar loop con velocidad normal
    loop = setInterval(main, velocidad);
}

function choquepared(){
    if(cabeza.x < 0 || cabeza.x > 590 || cabeza.y < 40 || cabeza.y > 590){
        gameover();
    }
}

function choquecuerpo(){
    var temp = null;
    try{
        temp = cabeza.getSiguiete().getSiguiete();
    }
    catch(error){
        temp = null;
    }
    while(temp != null){
        if(cabeza.choque(temp)){
            // fin de juego
            gameover();
        }
        else{
            temp = temp.getSiguiete();
        }
    }
}

function dibujar () {
    var canvas = document.getElementById("workspace");
    var contexto = canvas.getContext("2d");
    contexto.clearRect(0, 0, canvas.width, canvas.height);
    contexto.strokeStyle = "#932F67";
    contexto.strokeRect(0, 0, canvas.width, canvas.height);
    cabeza.dibujar(contexto,0);
    comida.dibujar(contexto);
    obstaculos.forEach(o => o.dibujar(contexto));
    contexto.fillStyle = "#f2f2f2";
    contexto.fillRect(0, 0, 600, 40); 

    contexto.strokeStyle = "#999";
    contexto.strokeRect(0, 0, 200, 40);

    contexto.fillStyle = "#000";
    contexto.font = "15px Arial";
    contexto.fillText(`Jugador: ${nombreJugador}`, 10, 20);
    contexto.fillText(`Puntaje: ${puntos}`, 10, 35);

}

// Funcion de renderizado
function main() {
    choquecuerpo();
    choquepared();
    dibujar();
    movimiento();
    for (let o of obstaculos) {
    if (cabeza.choque(o)) {
        gameover();
        return;
    }
}
    if(cabeza.choque(comida)){
        comida.colocar();
        cabeza.meter();
        puntos += 10;
        if (puntos % 50 === 0) {
        velocidad = Math.max(20, velocidad - 10);

        clearInterval(loop);
        loop = setInterval(main, velocidad);

        obstaculos.push(new Obstaculo());

        ultimoNivel = puntos;
        }
    }
}
//loop = setInterval(main, velocidad);

