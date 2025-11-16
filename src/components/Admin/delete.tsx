"use client";
import { TriangleAlert } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import type { AdminUser, AdminUsersResponse } from "@/queries/admin";
import { adminDeleteUser, getAdminUsers } from "@/queries/admin";

import { useWarningDialog } from "./WarningDialog";
const DeleteRoleCard = ({
  src,
  header,
  content,
  color,
  onClick,
  active,
}: {
  src: string;
  header: string;
  content: string;
  color: "red" | "sky" | "yellow";
  onClick?: () => void;
  active?: boolean;
}) => {
  let mapColor = "";
  switch (color) {
    case "red":
      mapColor = "red-500";
      break;
    case "sky":
      mapColor = "sky-400";
      break;
    case "yellow":
      mapColor = "yellow-500";
      break;
    default:
      mapColor = "gray-500";
  }
  return (
    <div
      className={`w-full rounded-lg border-3 bg-${mapColor} flex flex-col items-center justify-center gap-2 p-4 ${
        active ? "border-black" : "border-transparent"
      }`}
    >
      <h1
        className={`text-xl font-bold ${header === "Customer" ? "text-black" : "text-white"}`}
      >
        {header}
      </h1>
      <div className="flex gap-2">
        <div className="relative h-35 w-45">
          <Image
            src={src}
            alt="Eater Role"
            width={110}
            height={110}
            className="absolute"
          />
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <p
            className={`text-md font-medium ${header === "Customer" ? "text-black" : "text-white"}`}
          >
            {content}
          </p>
          <button
            className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-gray-500 shadow-md hover:bg-white active:bg-white/80"
            onClick={onClick}
          >
            Tap to select
          </button>
        </div>
      </div>
    </div>
  );
};
export function AdminDelete() {
  const [select, setSelect] = useState<number>(0);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [limit, setLimit] = useState<number>(10);
  const [offset, setOffset] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const { open } = useWarningDialog();

  async function fetchAndSetUsers(
    role?: string,
    limitParam?: number,
    offsetParam?: number
  ) {
    setLoadingUsers(true);
    setUsersError(null);
    const res = await getAdminUsers(
      role,
      limitParam ?? limit,
      offsetParam ?? offset
    );
    if (res.success) {
      setUsers(res.data ?? []);
      setTotal(res.total ?? 0);
    } else {
      setUsersError(res.message || "Failed to load users");
    }
    setLoadingUsers(false);
  }

  useEffect(() => {
    const role = roleToQueryParam(select);
    setLoadingUsers(true);
    setUsersError(null);
    void fetchAndSetUsers(role, limit, offset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [select, limit, offset]);
  return (
    <div className="flex w-full flex-col gap-8 p-8">
      <div className="flex w-full flex-col gap-6 rounded-2xl bg-white/30 p-8 shadow-md">
        <div className="flex items-center justify-between px-8">
          <div className="flex flex-col gap-2">
            <p className="text-app-tan font-medium">CRITICAL ACTION</p>
            <h1 className="text-3xl font-semibold">Delete user warning</h1>
            <p className="text-app-tan font-medium">
              Soft deleting action require double confirmation.
            </p>
          </div>
          <TriangleAlert size={60} className="text-red-900" />
        </div>
        <div className="border-app-tan/30 grid w-full rounded-xl border bg-white/80 p-4 shadow-xl">
          <div className="flex flex-col gap-2 px-4">
            <p className="text-app-tan text-sm font-medium">ROLE FILTER</p>
            <h1 className="text-2xl font-semibold">
              Filter users by persona before deleting
            </h1>
            <p className="text-app-tan text-sm font-medium">
              Tap one of the cartoon badges to load only those accounts.
            </p>
          </div>
          <div className="mt-4 flex w-full items-center gap-6 px-4">
            <DeleteRoleCard
              src="/images/meowth-eating.webp"
              header="Customer"
              content="Close wallet credits, saved addresses, and promo streeams for diners"
              color="red"
              onClick={() => {
                setSelect(1);
                setOffset(0);
              }}
              active={1 == select}
            />
            <DeleteRoleCard
              src="/images/meowth-driving.webp"
              header="Driver"
              content="Revoke fleet credentials and freeze active delivery slots."
              color="sky"
              onClick={() => {
                setSelect(2);
                setOffset(0);
              }}
              active={2 == select}
            />
            <DeleteRoleCard
              src="/images/meowth-cooking.webp"
              header="Restaurant"
              content="Detach menus, earnings, and kitchen from network"
              color="yellow"
              onClick={() => {
                setSelect(3);
                setOffset(0);
              }}
              active={3 == select}
            />
          </div>

          <p className="mt-4 px-4 text-sm font-light text-gray-500">
            Select one role to continue for deletion
          </p>
        </div>
        <div className="border-app-tan/30 bg-app-peanut/20 grid w-full rounded-xl border border-dashed p-4 shadow-xl">
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-semibold">Checklist before deletion</h1>
            <ul className="list-inside list-disc px-4 py-2">
              <li>Make sure the customer has no pending orders or payments.</li>
              <li>Check if any wallet balance or discount is left.</li>
              <li>Send a goodbye message to the customer automatically.</li>
            </ul>
          </div>
        </div>
        {/* <div className="flex items-center gap-4">
          <input
            type="number"
            placeholder="Enter User ID"
            className="rounded px-4 py-2"
            onChange={(e) => setUserIdToDelete(Number(e.target.value))}
          />
          <button
            className="border-app-tan/30 flex items-center justify-center gap-4 rounded-full border bg-red-800/90 px-8 py-2 text-white shadow-md hover:bg-red-900 active:bg-red-950"
            onClick={() =>
              open("user", "Customer", () => {
                void (async () => {
                  if (!userIdToDelete || isNaN(userIdToDelete)) return;
                  try {
                    await adminDeleteUser(userIdToDelete);
                    const r: AdminUsersResponse = await getAdminUsers(
                      roleToQueryParam(select),
                      limit,
                      offset
                    );
                    setUsers(r.data ?? []);
                    setTotal(r.total ?? 0);
                  } catch (err) {
                    console.error(err);
                  }
                })();
              })
            }
          >
            <Trash2 />
            Delete
          </button>
        </div> */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold">Users</h2>
          {loadingUsers ? (
            <p>Loading users...</p>
          ) : usersError ? (
            <p className="text-red-500">{usersError}</p>
          ) : (
            <div className="mt-4 grid gap-2">
              {users.length === 0 ? (
                <p>No users found for selected role.</p>
              ) : (
                users.map((u) => (
                  /* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
                  <div
                    key={u.id}
                    className="flex items-center justify-between rounded-md border p-2"
                  >
                    <div className="flex items-center gap-4">
                      <p className="font-medium">{u.id}</p>
                      <p>{u.email}</p>
                      <p className="text-sm text-gray-500">{u.role}</p>
                    </div>
                    <div>
                      <button
                        className="rounded border bg-red-700 px-4 py-1 text-white"
                        onClick={() =>
                          open(
                            {
                              id: u.id,
                              email: u.email,
                              role: u.role,
                              name: u.email.split("@")[0] ?? undefined,
                            },
                            () => {
                              void (async () => {
                                try {
                                  const deleteResult = await adminDeleteUser(
                                    u.id
                                  );
                                  if (!deleteResult.success) {
                                    console.error(deleteResult.message);
                                    return;
                                  }
                                  const r = await getAdminUsers(
                                    roleToQueryParam(select),
                                    limit,
                                    offset
                                  );
                                  if (r.success) {
                                    setUsers(r.data ?? []);
                                    setTotal(r.total ?? 0);
                                  } else {
                                    console.error(r.message);
                                  }
                                } catch (err) {
                                  console.error(err);
                                }
                              })();
                            }
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  /* eslint-enable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
                ))
              )}
            </div>
          )}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Page {Math.floor(offset / limit) + 1} of{" "}
              {Math.max(1, Math.ceil(total / limit))}
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500">Per page:</label>
              <select
                className="rounded border p-1"
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setOffset(0);
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <button
                disabled={offset === 0}
                className="rounded border px-3 py-1"
                onClick={() => setOffset(Math.max(offset - limit, 0))}
              >
                Previous
              </button>
              <button
                disabled={offset + limit >= total}
                className="rounded border px-3 py-1"
                onClick={() => setOffset(offset + limit)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function roleToQueryParam(select: number): string | undefined {
  switch (select) {
    case 1:
      return "customer";
    case 2:
      return "driver";
    case 3:
      return "restaurant";
    default:
      return undefined;
  }
}

// fetch users when role selection changes — handled inside component
