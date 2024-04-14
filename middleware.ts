import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
    // publicRoutes: ["/", "/conversation" , "/images", "/images/gimages", "/api/webhook"],
    // publicRoutes: ["((?!^/admin/|^/dashboard/).*)"],



});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
