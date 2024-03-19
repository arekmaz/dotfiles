vim.opt.guicursor = ""

vim.opt.nu = true
vim.opt.relativenumber = false

vim.opt.tabstop = 2
vim.opt.softtabstop = 2
vim.opt.shiftwidth = 2
vim.opt.expandtab = true

vim.opt.smartindent = true

vim.opt.smartcase = true
vim.opt.ignorecase = true

vim.opt.wrap = true

-- vim.opt.autochdir = true

vim.opt.swapfile = false
vim.opt.backup = false
vim.opt.undodir = os.getenv("HOME") .. "/.vim/undodir"
vim.opt.undofile = true

-- vim.opt.hlsearch = true
vim.opt.incsearch = true

vim.opt.termguicolors = true

vim.opt.scrolloff = 8
vim.opt.signcolumn = "no"
vim.opt.isfname:append("@-@")

vim.opt.updatetime = 50

vim.opt.colorcolumn = "80"

vim.opt.guicursor = "i:ver80-Cursor"

vim.g.netrw_liststyle=3

vim.g.netrw_list_hide = ".*\\.swp$,.DS_Store,*/tmp/*,*.so,*.swp,*.zip,*.git,^\\.\\.\\=/\\=$"

vim.g.netrw_preview = 1

vim.g.history = 10000
