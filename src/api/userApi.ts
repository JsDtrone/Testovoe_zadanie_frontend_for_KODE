import axios from "axios";
import { type FetchUserParams, type UsersResponse } from "../types";

const baseUrl =
  "https://stoplight.io/mocks/kode-frontend-team/koder-stoplight/86566464/users";

export const getUsers = async (
  params: FetchUserParams = {},
): Promise<UsersResponse> => {
  const { department = "all", dynamic = false, code } = params;
  const queryParams: Record<string, string | boolean | number> = {};
  if (code) {
    queryParams["__code"] = code;
  }
  if (dynamic) {
    queryParams["__dynamic"] = true;
  } else {
    queryParams["__example"] = department;
  }

  try {
    const response = await axios.get<UsersResponse>(baseUrl, {
      headers: { "Content-Type": "application/json" },
      params: queryParams,
    });
    return { items: response.data.items, statusCode: 200 };
  } catch {
    return { items: [], statusCode: 500 };
  }
};
