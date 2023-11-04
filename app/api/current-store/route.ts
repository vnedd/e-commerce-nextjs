import serverStore from "@/lib/server-store";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { store } = await serverStore();

        return NextResponse.json(store, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json('error', { status: 500 });
    }
}