let canvas;
let ctx;
let flowfield;
let flowfieldanimation;

//window onload waits for entire webpage to load
//document onload event fires when DOM is ready
window.onload = function(){
    canvas=document.getElementById('canvas1');
    ctx=canvas.getContext('2d'); //context variable
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;  
    flowfield = new FlowFieldEffect(ctx,canvas.width,canvas.height);
    flowfield.animate(0);
} 

window.addEventListener('resize', function(){
    cancelAnimationFrame(flowfieldanimation);
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
    flowfield = new FlowFieldEffect(ctx,canvas.width,canvas.height);  
    flowfield.animate(0);
});

const mouse = {
    x: 0,
    y: 0,
}

window.addEventListener('mousemove',function(e){
    mouse.x=e.x;
    mouse.y=e.y;
});

class FlowFieldEffect {
    #ctx;
    #width;
    #height;
    constructor(ctx,width,height){
        this.#ctx=ctx;
        this.#ctx.lineWidth=0.15;
        this.#width=width;
        this.#height=height;
        this.lastTime=0;
        this.interval=1000/60; //repeat every 16.66ms i.e. 60 frames/s
        this.timer=0;
        this.cellSize=10;
        this.gradient;
        this.#createGradient();
        this.#ctx.strokeStyle=this.gradient;
        this.radius=0;
        this.vr=0.015; //velocity of radius
    }

    #createGradient(){
        this.gradient=this.#ctx.createLinearGradient(0,0,this.#width,this.#height);
        this.gradient.addColorStop("0.15","#ff5c33");
        this.gradient.addColorStop("0.28","#ff66b3");
        this.gradient.addColorStop("0.42","#ccccff");
        this.gradient.addColorStop("0.56","#b3ffff");
        this.gradient.addColorStop("0.71","#80ff80");
        this.gradient.addColorStop("0.86","#ffff33");
    }

    #drawLine(angle,x,y){
        let positionX=x;
        let positionY=y;

        let dx=mouse.x-positionX;
        let dy=mouse.y-positionY;

        let d=(dx*dx+dy*dy);
        
        if(d>1000000) d=1000000;
        if(d<50000) d=50000;

        let length=d*0.0001;

        this.#ctx.beginPath();
        this.#ctx.moveTo(x,y);
        this.#ctx.lineTo(x+Math.cos(angle)*length, y+Math.sin(angle)*length);
        this.#ctx.stroke();
        //instead of sin cos we can also do perlin noise/simplex noise
    }   

    animate(timeStamp){
        const deltaTime = timeStamp - this.lastTime; //to synchronize movement of animation
        this.lastTime = timeStamp;
        
        if(this.timer > this.interval){
            this.#ctx.clearRect(0,0,this.#width,this.#height);
            
            this.radius+=this.vr;
            if(this.radius>1.2||this.radius<-1.2) this.vr*=-1;

            for(let y=0;y<this.#height;y+=this.cellSize){
                for(let x=0; x<this.#width;x+=this.cellSize){
                    const angle=(Math.cos(x*0.01)+Math.sin(y*0.01)) * this.radius;
                    this.#drawLine(angle,x, y);
                }
            }
            
            this.timer=0;
        }
        else{
            this.timer+=deltaTime;
        }
        
        flowfieldanimation = requestAnimationFrame(this.animate.bind(this));
    }
}