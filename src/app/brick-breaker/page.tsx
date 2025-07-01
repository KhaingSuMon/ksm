"use client";
import { useEffect, useRef } from "react";

export default function BrickBreakerPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const paddleHeight = 10;
    const paddleWidth = 75;
    let paddleX = (canvas.width - paddleWidth) / 2;

    let score = 0;
    const maxLives = 3;
    let lives = maxLives;


    const ballRadius = 10;
    let x = canvas.width / 2;
    let y = canvas.height - 30;
    let dx = 1.5;
    let dy = -1.5;

    const brickRowCount = 5;
    const brickColumnCount = 3;
    const brickWidth = 75;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 30;

    const bricks: { x: number; y: number; status: number }[][] = [];
    for (let c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }
    const totalBricks = brickRowCount * brickColumnCount;

    let message = "";
    let messageTimer = 0;

    const showMessage = (m: string) => {
      message = m;
      messageTimer = Date.now() + 2000;
    };

    const startRound = () => {

      x = canvas.width / 2;
      y = canvas.height - 30;
      dx = 1.5;
      dy = -1.5;
      paddleX = (canvas.width - paddleWidth) / 2;
    };

    const resetGame = () => {
      score = 0;
      lives = maxLives;

      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          bricks[c][r].status = 1;
        }
      }
      startRound();

    };

    resetGame();

    let rightPressed = false;
    let leftPressed = false;

    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
      } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
      }
    };

    const keyUpHandler = (e: KeyboardEvent) => {
      if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
      } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
      }
    };

    const pointerMoveHandler = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      paddleX = e.clientX - rect.left - paddleWidth / 2;
      paddleX = Math.max(0, Math.min(canvas.width - paddleWidth, paddleX));
    };

    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);
    canvas.addEventListener("pointermove", pointerMoveHandler);


    function collisionDetection() {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          const b = bricks[c][r];
          if (b.status === 1) {
            if (
              x > b.x &&
              x < b.x + brickWidth &&
              y > b.y &&
              y < b.y + brickHeight
            ) {
              dy = -dy;
              b.status = 0;
              score += 1;
              if (score === totalBricks) {
                showMessage("You Win!");
                resetGame();
              }
            }
          }
        }
      }
    }

    const drawBall = () => {
      ctx.beginPath();
      ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#a855f7"; // purple
      ctx.fill();
      ctx.closePath();
    };

    const drawPaddle = () => {
      ctx.beginPath();
      ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
      ctx.fillStyle = "#f472b6"; // pink
      ctx.fill();
      ctx.closePath();
    };

    const drawBricks = () => {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          if (bricks[c][r].status === 1) {
            const brickX = r * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = c * (brickHeight + brickPadding) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = "#c084fc"; // violet
            ctx.fill();
            ctx.closePath();
          }
        }
      }
    };

    const drawInfo = () => {
      ctx.font = "16px sans-serif";
      ctx.fillStyle = "#4c1d95";
      ctx.textAlign = "left";
      ctx.fillText(`Score: ${score}`, 8, 20);
      ctx.fillText(`Lives: ${lives}`, canvas.width - 80, 20);
    };

    const drawMessage = () => {
      if (message && Date.now() < messageTimer) {
        ctx.font = "20px sans-serif";
        ctx.fillStyle = "#b91c1c";
        ctx.textAlign = "center";
        ctx.fillText(message, canvas.width / 2, canvas.height / 2);
      }
    };


    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBricks();
      drawBall();
      drawPaddle();
      drawInfo();
      drawMessage();

      collisionDetection();

      if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
      }
      if (y + dy < ballRadius) {
        dy = -dy;
      } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
          dx = (x - (paddleX + paddleWidth / 2)) * 0.15;
          dy = -Math.abs(dy);
        } else {
          lives -= 1;
          if (lives > 0) {
            startRound();
          } else {
            showMessage("Game Over");
            resetGame();
          }

        }
      }

      x += dx;
      y += dy;

      if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
      } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
      }

      requestAnimationFrame(draw);
    };
    draw();

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keyup", keyUpHandler);
      canvas.removeEventListener("pointermove", pointerMoveHandler);

    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 flex items-center justify-center p-4">
      <canvas
        ref={canvasRef}
        width={480}
        height={320}
        className="bg-white rounded-lg shadow-lg"
      />
    </div>
  );
}
