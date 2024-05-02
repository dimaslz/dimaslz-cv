import type { RequestHandler } from "./$types";
import { printPDF } from "@/utils";

export const POST: RequestHandler = async ({ request }: { request: Request }) => {
	const { url } = await request.json();

	const pdfFile = await printPDF({ url: `${url}?pdf` }).then(pdf => {
		return pdf;
	});

	const currentYear: number = (new Date()).getFullYear();

	return new Response(
		pdfFile,
		{
			status: 200,
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': `attachment; filename=dimas-lopez-zurita-resume-${currentYear}.pdf`
			}
		}
	)
}