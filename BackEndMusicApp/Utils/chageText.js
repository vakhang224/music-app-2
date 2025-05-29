function removeVietnameseTones(str) {
  return str
    .normalize("NFD")                      // Tách dấu
    .replace(/[\u0300-\u036f]/g, "")       // Xoá dấu
    .replace(/đ/g, "d")                    // thay đ
    .replace(/Đ/g, "d")                    // thay Đ
    .toLowerCase();                        // chuyển thành chữ thường
}

module.exports = removeVietnameseTones