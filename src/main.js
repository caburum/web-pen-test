import './app.css';
import App from './App.svelte';

const app = new App({
	target: /** @type {Element} */ (document.getElementById('app')),
});

export default app;
