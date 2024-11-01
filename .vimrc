colorscheme default
set nocompatible
set termguicolors

set ignorecase
set smartcase
set incsearch
set expandtab
set softtabstop=2
set updatetime=50

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

set textwidth=80

set hlsearch
set linebreak
set laststatus=0
set nolist

set wrapscan
set wrap

set mouse=a

set history=10000

set wildmenu

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
