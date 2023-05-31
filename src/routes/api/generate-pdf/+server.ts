import puppeteer, { type PaperFormat } from "puppeteer";
import type { RequestHandler } from "./$types";

const PDF_WIDTH = 793;

type Params = {
	url: string;
	format?: PaperFormat;
};

async function printPDF(
	{ url = "", format = "A4" }: Params
) {
	const browser = await puppeteer.launch({
		headless: "new",
		args: [
			"--disable-gpu",
			"--disable-dev-shm-usage",
			"--disable-setuid-sandbox",
			"--no-sandbox",
		],
	});
	const page = await browser.newPage();

	await page.goto(url, { waitUntil: 'networkidle0' });

	await page.waitForSelector('#CV', {
		visible: true,
	});

	const maxWidth = PDF_WIDTH;
	const height = await page.evaluate(
		() => document.documentElement.offsetHeight
	);

	const numberOfPages = Math.ceil(height / 1040);
	const pdf = await page.pdf({
		printBackground: true,
		width: maxWidth,
		format,
		pageRanges: Array.from(new Array(numberOfPages)).map((_, key) => key + 1).join(","),
	});

	await browser.close();
	return pdf
}


export const POST = async ({ request }: { request: RequestHandler }) => {
	const { url } = await request.json();

	const pdfFile = await printPDF({ url: `${url}?pdf` }).then(pdf => {
		return pdf;
	});

	return new Response(
		pdfFile,
		{
			status: 200,
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': 'attachment; filename=dummy.pdf'
			}
		}
	)
}