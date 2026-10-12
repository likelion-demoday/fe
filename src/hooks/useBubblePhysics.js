import { useCallback, useEffect, useRef } from "react";

const GRAVITY = 2300; 
const WALL_BOUNCE = 0.2;
const BUBBLE_BOUNCE = 0.45;
const AIR_DAMPING = 0.995;
const FLOOR_FRICTION = 0.9;
const SUB_STEPS = 4;
const MAX_FRAME_SEC = 1 / 30;
const SLEEP_SPEED = 8; 
const SLEEP_AFTER_SEC = 0.6;

const KICK_UP_MIN = 300;
const KICK_UP_RANGE = 110;
const KICK_SIDE = 150;
const NEIGHBOR_JOLT_RATIO = 0.45;


const INTRO_DROP = 50; 
const INTRO_BOUNCE = 8; 
const INTRO_DURATION_MS = 650;
const INTRO_STAGGER_MS = 90;
const EASE_IN = "cubic-bezier(0.55, 0, 1, 0.45)";
const EASE_OUT = "cubic-bezier(0, 0.55, 0.45, 1)";

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const moveAndHitWalls = (body, dt, width, height, top) => {
  body.vy += GRAVITY * dt;
  body.vx *= AIR_DAMPING;
  body.vy *= AIR_DAMPING;
  body.x += body.vx * dt;
  body.y += body.vy * dt;

  if (body.x - body.r < 0) {
    body.x = body.r;
    body.vx = Math.abs(body.vx) * WALL_BOUNCE;
  } else if (body.x + body.r > width) {
    body.x = width - body.r;
    body.vx = -Math.abs(body.vx) * WALL_BOUNCE;
  }
  if (body.y - body.r < top) {
    body.y = top + body.r;
    body.vy = Math.abs(body.vy) * WALL_BOUNCE;
  } else if (body.y + body.r > height) {
    body.y = height - body.r;
    body.vy = -Math.abs(body.vy) * WALL_BOUNCE;
    body.vx *= FLOOR_FRICTION;
  }
};

const resolveCollision = (a, b) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy) || 0.0001;
  const overlap = a.r + b.r - dist;
  if (overlap <= 0) return;

  const nx = dx / dist;
  const ny = dy / dist;
  const massA = a.r * a.r;
  const massB = b.r * b.r;
  const total = massA + massB;

  a.x -= nx * overlap * (massB / total);
  a.y -= ny * overlap * (massB / total);
  b.x += nx * overlap * (massA / total);
  b.y += ny * overlap * (massA / total);

  const relative = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
  if (relative >= 0) return;

  const impulse = (-(1 + BUBBLE_BOUNCE) * relative) / (1 / massA + 1 / massB);
  a.vx -= (impulse / massA) * nx;
  a.vy -= (impulse / massA) * ny;
  b.vx += (impulse / massB) * nx;
  b.vy += (impulse / massB) * ny;
};

const stepBodies = (bodies, dt, width, height, top) => {
  bodies.forEach((body) => moveAndHitWalls(body, dt, width, height, top));
  for (let i = 0; i < bodies.length; i += 1) {
    for (let j = i + 1; j < bodies.length; j += 1) {
      resolveCollision(bodies[i], bodies[j]);
    }
  }
};

/**
 * 수박게임처럼 원들이 중력·충돌로 움직이는 물리 시뮬레이션
 * - 처음엔 디자인 배치 그대로 멈춰 있다가, kick(index)이 호출되면 중력이 켜짐
 * - 매 프레임 setState 대신 DOM transform을 직접 갱신
 *
 * @param bubbles [{ x, y, size }] 영역 기준 좌상단 좌표
 * @param width, height 원들이 쌓이는 영역 크기 (바닥 = height)
 * @param top 천장 위치. 음수면 영역 위로 잠깐 튀어 올랐다 떨어질 수 있음
 */
const useBubblePhysics = (bubbles, width, height, top = 0) => {
  const elementsRef = useRef([]);
  const bodiesRef = useRef(null);
  const frameRef = useRef(null);
  const restTimeRef = useRef(0);
  const introAnimationsRef = useRef([]);

  if (bodiesRef.current === null) {
    bodiesRef.current = bubbles.map(({ x, y, size }) => ({
      x: x + size / 2,
      y: y + size / 2,
      r: size / 2,
      vx: 0,
      vy: 0,
    }));
  }

  const render = useCallback(() => {
    bodiesRef.current.forEach((body, index) => {
      const el = elementsRef.current[index];
      if (el) el.style.transform = `translate(${body.x - body.r}px, ${body.y - body.r}px)`;
    });
  }, []);

  const kick = useCallback(
    (index) => {
      if (prefersReducedMotion()) return;

      introAnimationsRef.current.forEach((animation) => animation.cancel());
      introAnimationsRef.current = [];

      bodiesRef.current.forEach((body, i) => {
        const ratio = i === index ? 1 : NEIGHBOR_JOLT_RATIO;
        body.vy -= (KICK_UP_MIN + Math.random() * KICK_UP_RANGE) * ratio;
        body.vx += (Math.random() - 0.5) * 2 * KICK_SIDE * ratio;
      });
      restTimeRef.current = 0;

      if (frameRef.current !== null) return;

      let lastTime = performance.now();
      const loop = (now) => {
        const dt = Math.min(MAX_FRAME_SEC, Math.max(0, (now - lastTime) / 1000));
        lastTime = now;

        for (let i = 0; i < SUB_STEPS; i += 1) {
          stepBodies(bodiesRef.current, dt / SUB_STEPS, width, height, top);
        }
        render();

        const moving = bodiesRef.current.some((b) => Math.hypot(b.vx, b.vy) > SLEEP_SPEED);
        restTimeRef.current = moving ? 0 : restTimeRef.current + dt;

        frameRef.current =
          restTimeRef.current > SLEEP_AFTER_SEC ? null : requestAnimationFrame(loop);
      };
      frameRef.current = requestAnimationFrame(loop);
    },
    [width, height, top, render],
  );

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const toTransform = (body, offsetY) =>
      `translate(${body.x - body.r}px, ${body.y - body.r - offsetY}px)`;

    introAnimationsRef.current = bodiesRef.current.flatMap((body, index) => {
      const el = elementsRef.current[index];
      if (!el) return [];
      return el.animate(
        [
          { transform: toTransform(body, INTRO_DROP), opacity: 0, easing: EASE_IN },
          { transform: toTransform(body, 0), opacity: 1, offset: 0.6, easing: EASE_OUT },
          { transform: toTransform(body, INTRO_BOUNCE), opacity: 1, offset: 0.8, easing: EASE_IN },
          { transform: toTransform(body, 0), opacity: 1 },
        ],
        { duration: INTRO_DURATION_MS, delay: INTRO_STAGGER_MS * index, fill: "backwards" },
      );
    });

    return () => {
      introAnimationsRef.current.forEach((animation) => animation.cancel());
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const setElement = useCallback(
    (index) => (el) => {
      elementsRef.current[index] = el;
    },
    [],
  );

  return { setElement, kick };
};

export default useBubblePhysics;
