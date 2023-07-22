<script lang="ts">
	import { onMount } from 'svelte';

	let videoSource: HTMLVideoElement;
	let errorMsg: boolean = false;
	const obtenerVideoCamara = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: true
			});
			videoSource.srcObject = stream;
			videoSource.play();
		} catch (error) {
			console.log(error);
			errorMsg = true;
		}
	};

	function delay(time: number) {
		return new Promise((resolve) => setTimeout(resolve, time));
	}

	async function uploadFunction(imgBase64: string) {
		const data = { image: '', meta: '' };
		const imgData = imgBase64.split(',');
		data['image'] = imgData[1];
		data['meta'] = imgData[0];

		console.log(data);
		await fetch(`/upload`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify(data)
		});
	}

	onMount(() => {
		const height = screen.height;
		const width = screen.width;
		const canvas = <HTMLCanvasElement>document.getElementById('canvas');
		function takepicture() {
			const context = canvas?.getContext('2d');
			canvas.width = width;
			canvas.height = height;
			context?.drawImage(videoSource, 0, 0, width, height);

			const data = canvas?.toDataURL('image/png');
			return data;
		}
		obtenerVideoCamara().then(() =>
			delay(500).then(() => {
				const img = takepicture();
        uploadFunction(img)
			})
		);
	});
</script>

<div>
	<!-- svelte-ignore a11y-media-has-caption -->
	<canvas id="canvas" />
	<video bind:this={videoSource} />
	{#if errorMsg}
		<h1>Error</h1>
	{/if}
</div>
