"use client";

import { useEffect, useRef, useState } from "react";
import {
  FilesetResolver,
  PoseLandmarker,
  DrawingUtils,
} from "@mediapipe/tasks-vision";
import styles from "./Camera.module.css";
import RightBoard from "../../components/RightBoard/RightBoard";

export default function Camera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState("Carregando modelo...");
  const [useImage, setUseImage] = useState(false); // alterna entre imagem e câmera

  useEffect(() => {
    let poseLandmarker: PoseLandmarker;
    let animationFrameId: number;

    // Helpers to evaluate posture
    const getPoint = (lm: any[], idx: number) => ({
      x: lm[idx].x,
      y: lm[idx].y,
    });

    const toDeg = (rad: number) => (rad * 180) / Math.PI;

    const angleBetween = (
      a: { x: number; y: number },
      b: { x: number; y: number },
      c: { x: number; y: number }
    ) => {
      // angle at point b between BA and BC
      const v1 = { x: a.x - b.x, y: a.y - b.y };
      const v2 = { x: c.x - b.x, y: c.y - b.y };
      const dot = v1.x * v2.x + v1.y * v2.y;
      const mag1 = Math.hypot(v1.x, v1.y);
      const mag2 = Math.hypot(v2.x, v2.y);
      if (mag1 === 0 || mag2 === 0) return 0;
      const cos = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
      return toDeg(Math.acos(cos));
    };

    const midpoint = (
      p1: { x: number; y: number },
      p2: { x: number; y: number }
    ) => ({ x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 });

    const evaluatePosture = (lm: any[]) => {
      const msgs: string[] = [];
      // indices: left shoulder 11, right shoulder 12, left hip 23, right hip 24, left knee 25, right knee 26, left ankle 27, right ankle 28
      const hasRight = lm[24] && lm[26] && lm[28];
      const hasLeft = lm[23] && lm[25] && lm[27];

      let kneeAngleRight = NaN;
      let kneeAngleLeft = NaN;

      if (hasRight)
        kneeAngleRight = angleBetween(
          getPoint(lm, 24),
          getPoint(lm, 26),
          getPoint(lm, 28)
        );
      if (hasLeft)
        kneeAngleLeft = angleBetween(
          getPoint(lm, 23),
          getPoint(lm, 25),
          getPoint(lm, 27)
        );

      const angles = [] as number[];
      if (!Number.isNaN(kneeAngleRight)) angles.push(kneeAngleRight);
      if (!Number.isNaN(kneeAngleLeft)) angles.push(kneeAngleLeft);

      const avgKneeAngle = angles.length
        ? angles.reduce((a, b) => a + b, 0) / angles.length
        : 180;

      // trunk angle: angle between shoulder midpoint and hip midpoint relative to vertical
      let trunkLean = 0;
      if (lm[11] && lm[12] && lm[23] && lm[24]) {
        const shoulder = midpoint(getPoint(lm, 11), getPoint(lm, 12));
        const hip = midpoint(getPoint(lm, 23), getPoint(lm, 24));
        const v = { x: shoulder.x - hip.x, y: shoulder.y - hip.y };
        // angle between v and up vector (0,-1)
        const up = { x: 0, y: -1 };
        const dot = v.x * up.x + v.y * up.y;
        const magV = Math.hypot(v.x, v.y);
        trunkLean =
          magV === 0
            ? 0
            : Math.abs(toDeg(Math.acos(Math.max(-1, Math.min(1, dot / magV)))));
      }

      // heuristics
      const squatThreshold = 120; // knee angle below this means bent/squat
      const trunkLeanThreshold = 25; // degrees

      const isSquatting = avgKneeAngle < squatThreshold;
      if (isSquatting) msgs.push("Agachando");
      else msgs.push("Em pé");

      if (isSquatting && avgKneeAngle < 60)
        msgs.push("Agachamento muito profundo");
      if (trunkLean > trunkLeanThreshold)
        msgs.push("Tronco inclinado (muito à frente)");

      const postureOk = !(
        trunkLean > trunkLeanThreshold ||
        (isSquatting && avgKneeAngle < 60)
      );

      return {
        isSquatting,
        avgKneeAngle,
        trunkLean,
        postureOk,
        messages: msgs,
      };
    };

    const drawStatusOnCanvas = (
      ctx: CanvasRenderingContext2D,
      text: string
    ) => {
      const padding = 8;
      ctx.font = "14px Inter, system-ui, Arial";
      const metrics = ctx.measureText(text);
      const w = metrics.width + padding * 2;
      const h = 24 + padding;
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.fillRect(8, 8, w, h);
      ctx.fillStyle = "#fff";
      ctx.fillText(text, 8 + padding, 8 + 16);
    };

    const initPose = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
      );

      poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task",
        },
        runningMode: useImage ? "IMAGE" : "VIDEO",
        numPoses: 1,
      });

      if (useImage) {
        loadImage(poseLandmarker);
      } else {
        startCamera(poseLandmarker);
      }
    };

    const loadImage = async (poseLandmarker: PoseLandmarker) => {
      setStatus("Carregando imagem...");
      const img = new Image();
      img.src = "/images/teste1.jpg"; // imagem dentro de /public/teste.jpg
      img.onload = async () => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;
        const drawingUtils = new DrawingUtils(ctx);

        const result = await poseLandmarker.detect(img);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        if (result.landmarks && result.landmarks.length > 0) {
          const lm = result.landmarks[0];
          drawingUtils.drawLandmarks(lm, { radius: 3, color: "aqua" });
          drawingUtils.drawConnectors(lm, PoseLandmarker.POSE_CONNECTIONS);
          const evalRes = evaluatePosture(lm);
          let message = "";
          if (evalRes.isSquatting) {
            if (evalRes.postureOk)
              message = `🟢 Agachado — postura OK (joelho ${evalRes.avgKneeAngle.toFixed(
                0
              )}°, tronco ${evalRes.trunkLean.toFixed(0)}°)`;
            else
              message = `🟡 Agachado — ajustes: ${evalRes.messages.join(", ")}`;
          } else {
            if (evalRes.trunkLean > 20)
              message = `🔵 Em pé — tronco inclinado (${evalRes.trunkLean.toFixed(
                0
              )}°)`;
            else message = `🔵 Em pé`;
          }
          setStatus(message);
          drawStatusOnCanvas(ctx, message);
        } else {
          setStatus("❌ Nenhuma pessoa detectada.");
        }
      };
    };

    const startCamera = async (poseLandmarker: PoseLandmarker) => {
      setStatus("Abrindo câmera...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });

      if (!videoRef.current) return;
      videoRef.current.srcObject = stream;
      videoRef.current.onloadeddata = () => detectVideo(poseLandmarker);
    };

    const detectVideo = async (poseLandmarker: PoseLandmarker) => {
      const video = videoRef.current!;
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;
      const drawingUtils = new DrawingUtils(ctx);

      const loop = async () => {
        poseLandmarker.detectForVideo(video, performance.now(), (result) => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          if (result.landmarks && result.landmarks.length > 0) {
            const lm = result.landmarks[0];
            drawingUtils.drawLandmarks(lm, { radius: 3, color: "aqua" });
            drawingUtils.drawConnectors(lm, PoseLandmarker.POSE_CONNECTIONS);

            // avaliar postura
            const evalRes = evaluatePosture(lm);
            let message = "";
            if (evalRes.isSquatting) {
              if (evalRes.postureOk)
                message = `🟢 Agachado — postura OK (joelho ${evalRes.avgKneeAngle.toFixed(
                  0
                )}°, tronco ${evalRes.trunkLean.toFixed(0)}°)`;
              else
                message = `🟡 Agachado — ajustes: ${evalRes.messages.join(
                  ", "
                )}`;
            } else {
              if (evalRes.trunkLean > 20)
                message = `🔵 Em pé — tronco inclinado (${evalRes.trunkLean.toFixed(
                  0
                )}°)`;
              else message = `🔵 Em pé`;
            }
            setStatus(message);
            drawStatusOnCanvas(ctx, message);
          }
        });
        animationFrameId = requestAnimationFrame(loop);
      };
      loop();
    };

    initPose();
    return () => cancelAnimationFrame(animationFrameId);
  }, [useImage]);

  return (
    <div className={styles.reverseContainer}>
      <div className={styles.mainContainer}>
        <div className={styles.card}>
          <h1 className={styles.title}>Câmera</h1>
          <p className={styles.status}>{status}</p>

          <div className={styles.controls}>
            <button
              onClick={() => setUseImage(!useImage)}
              className={styles.button}
              type="button"
            >
              {useImage ? "Usar câmera" : "Usar imagem"}
            </button>
          </div>

          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={useImage ? styles.hidden : styles.video}
          />

          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            className={styles.canvas}
          />
        </div>
      </div>
      <RightBoard hideStatsOnMobile />
    </div>
  );
}
