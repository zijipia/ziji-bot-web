"use client";
import React, { useEffect, useRef } from "react";

const AudioSpectrum = ({ audioSrc }) => {
	const canvasRef = useRef(null);
	const audioRef = useRef(null);
	const animationIdRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");

		const audio = audioRef.current;
		const audioContext = new (window.AudioContext || window.webkitAudioContext)();
		const analyser = audioContext.createAnalyser();
		const source = audioContext.createMediaElementSource(audio);

		source.connect(analyser);
		analyser.connect(audioContext.destination);
		analyser.fftSize = 256;

		const bufferLength = analyser.frequencyBinCount;
		const dataArray = new Uint8Array(bufferLength);

		const draw = () => {
			animationIdRef.current = requestAnimationFrame(draw);
			analyser.getByteFrequencyData(dataArray);

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			const barWidth = (canvas.width / bufferLength) * 2.5;
			let barHeight;
			let x = 0;

			for (let i = 0; i < bufferLength; i++) {
				barHeight = dataArray[i];
				ctx.fillStyle = `rgb(${barHeight + 100},50,150)`;
				ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
				x += barWidth + 1;
			}
		};

		draw();

		return () => {
			cancelAnimationFrame(animationIdRef.current);
			audioContext.close();
		};
	}, []);

	return (
		<div className='audio-spectrum'>
			<audio
				ref={audioRef}
				src={audioSrc}
				controls
			/>
			<canvas
				ref={canvasRef}
				width={600}
				height={300}
			/>
		</div>
	);
};

export default AudioSpectrum;
