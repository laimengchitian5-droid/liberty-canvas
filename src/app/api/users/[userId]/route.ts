import { NextResponse } from "next/server";

import { verifyUserApiAccess } from "@/lib/auth/verifyUserApiAccess";

import { USER_DATA_HTTP } from "@/lib/user/constants";

import { resolveUserData } from "@/lib/user/repository";

import {

  userDataRouteParamsSchema,

  userDataSchema,

} from "@/lib/validation/userSchema";



export const runtime = "nodejs";



interface RouteContext {

  params: {

    userId: string;

  };

}



function jsonError(message: string, status: number, details?: unknown) {

  return NextResponse.json(

    { error: message, ...(details !== undefined ? { details } : {}) },

    { status },

  );

}



export async function GET(request: Request, context: RouteContext) {

  const parsedParams = userDataRouteParamsSchema.safeParse(context.params);



  if (!parsedParams.success) {

    return jsonError(

      "Invalid userId",

      USER_DATA_HTTP.unprocessable,

      parsedParams.error.flatten(),

    );

  }



  const access = await verifyUserApiAccess(

    parsedParams.data.userId,

    request.headers.get("cookie"),

  );



  if (!access.allowed) {

    return jsonError(access.message, access.status);

  }



  try {

    const data = await resolveUserData(parsedParams.data.userId);

    const validated = userDataSchema.safeParse(data);



    if (!validated.success) {

      return jsonError(

        "User data contract violation",

        USER_DATA_HTTP.serverError,

        validated.error.flatten(),

      );

    }



    return NextResponse.json(

      { data: validated.data },

      {

        status: 200,

        headers: {

          "Cache-Control": "private, no-store",

        },

      },

    );

  } catch (error) {

    return jsonError(

      error instanceof Error ? error.message : "Failed to resolve user data",

      USER_DATA_HTTP.serverError,

    );

  }

}


