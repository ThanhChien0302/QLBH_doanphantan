const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
    try {
        // Lấy token từ header Authorization: "Bearer <token>"
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ message: "No token provided" });

        const token = authHeader.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Token missing" });

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Lưu thông tin user vào req
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

// Middleware kiểm tra chỉ admin mới được truy cập
exports.adminOnly = (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin only" });
    next();
};
