colorscheme default
set nocompatible
set termguicolors

set ignorecase
set smartcase
set incsearch
set expandtab
set softtabstop=2

set shiftwidth=2
set smartindent
set ruler

set smarttab

set undodir=~/.vim/undodir
set noundofile
set noswapfile
set nobackup

set textwidth=80

set hlsearch
set incsearch
set linebreak
set laststatus=0


set wrapscan
set wrap

set ttyfast

set mouse=a

set history=10000

set wildmenu
" trigger autocompletion with ctrl+n
set wildchar=<C-n>

"visual mode highlight
highlight Visual ctermbg=white ctermfg=Black guibg=white guifg=Black

highlight CursorLine ctermbg=white ctermfg=Black guibg=white guifg=Black

"highlight search
hi Search cterm=NONE ctermfg=white ctermbg=blue guibg=white guifg=Black

"make bprevious shortcut usable on mac [usually ctrl+(l|r) arrow]
nnoremap <C-h> :bprevious<CR>
nnoremap <C-l> :bnext<CR>

" set error format to ts
compiler tsc
set makeprg=npx\ tsc

" ignore node_modules with builtin find
set wildignore+=*/node_modules/*

set path=**
