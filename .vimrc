let g:mapleader = " "
set nocompatible
set termguicolors

colorscheme evening

set ignorecase
set smartcase
set incsearch
set expandtab
set softtabstop=2
set updatetime=50

"sign column off
set scl=no

set shiftwidth=2
set smartindent
set ruler
let g:netrw_list_hide=".*\\.swp$,.DS_Store,*/tmp/*,*.so,*.swp,*.zip,*.git,^\\.\\.\\=/\\=$"

set smarttab

set undodir=~/.vim/undodir
set undofile
set noundofile
set noswapfile
set nobackup

set hlsearch
set linebreak
set laststatus=0
set nolist

set wrapscan
set wrap

set mouse=a

set history=10000

"transparent background for all editor groups
highlight Normal guibg=NONE ctermbg=NONE
highlight NonText guibg=NONE ctermbg=NONE
highlight LineNr guibg=NONE ctermbg=NONE
highlight SignColumn guibg=NONE ctermbg=NONE
highlight Comment guibg=NONE ctermbg=NONE
highlight Constant guibg=NONE ctermbg=NONE
highlight Special guibg=NONE ctermbg=NONE
highlight Identifier guibg=NONE ctermbg=NONE
highlight Statement guibg=NONE ctermbg=NONE
highlight PreProc guibg=NONE ctermbg=NONE
highlight Type guibg=NONE ctermbg=NONE
highlight Underlined guibg=NONE ctermbg=NONE
highlight Todo guibg=NONE ctermbg=NONE
highlight String guibg=NONE ctermbg=NONE
highlight Function guibg=NONE ctermbg=NONE
highlight Conditional guibg=NONE ctermbg=NONE
highlight Repeat guibg=NONE ctermbg=NONE
highlight Operator guibg=NONE ctermbg=NONE
highlight Structure guibg=NONE ctermbg=NONE
highlight CursorLineNr guibg=NONE ctermbg=NONE
highlight EndOfBuffer guibg=NONE ctermbg=NONE
highlight VertSplit guibg=NONE ctermbg=NONE

"transparent background for all netrw groups
highlight NetrwDir guibg=NONE ctermbg=NONE
highlight NetrwClassify guibg=NONE ctermbg=NONE
highlight NetrwLink guibg=NONE ctermbg=NONE
highlight NetrwList guibg=NONE ctermbg=NONE
highlight NetrwHelpCmd guibg=NONE ctermbg=NONE
highlight NetrwExec guibg=NONE ctermbg=NONE
highlight NetrwPlain guibg=NONE ctermbg=NONE
highlight NetrwTreeBar guibg=NONE ctermbg=NONE
highlight NetrwSymLink guibg=NONE ctermbg=NONE
highlight Normal guibg=NONE ctermbg=NONE
highlight EndOfBuffer guibg=NONE ctermbg=NONE

"visual mode highlight
highlight Visual ctermbg=white ctermfg=Black guibg=white guifg=Black

highlight CursorLine ctermbg=white ctermfg=Black guibg=white guifg=Black

"highlight search
highlight Search cterm=NONE ctermfg=white ctermbg=blue guibg=white guifg=Black

"make bprevious shortcut usable on mac [usually ctrl+(l|r) arrow]
nnoremap <C-h> :bprevious<CR>
nnoremap <C-l> :bnext<CR>

" set error format to ts
autocmd FileType typescript compiler tsc
autocmd FileType typescript set makeprg=npx\ tsc

" ignore node_modules with builtin find
set wildignore+=*/node_modules/*
