/**
 * 粒子原型, 提供一个绘图函数
 */
export function ExplodingParticle() {
    this.animationDuration = 1000; // in ms

    // Set the speed for our particle
    this.speed = {
        x: -5 + Math.random() * 10,
        y: -5 + Math.random() * 10
    };

    // Size our particle
    this.radius = 5 + Math.random() * 5;

    // Set a max time to live for our particle
    this.life = 30 + Math.random() * 10;
    this.remainingLife = this.life;

    // This function will be called by our animation logic later on
    this.draw = ctx => {
        let p = this;

        if (this.remainingLife > 0 && this.radius > 0) {
            // Draw a circle at the current location
            ctx.beginPath();
            ctx.arc(p.startX, p.startY, p.radius, 0, Math.PI * 2);
            ctx.fillStyle =
                "rgba(" +
                this.rgbArray[0] +
                "," +
                this.rgbArray[1] +
                "," +
                this.rgbArray[2] +
                ", 1)";
            ctx.fill();

            // Update the particle's location and life
            p.remainingLife--;
            p.radius -= 0.25;
            p.startX += p.speed.x;
            p.startY += p.speed.y;
        }
    };
};
