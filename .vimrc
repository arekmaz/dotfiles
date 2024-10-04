set nocompatible

set ignorecase
set incsearch
set expandtab
set softtabstop=2

set shiftwidth=2
set smartindent
set ruler

set smarttab

set undodir=~/.vim/undodir
set undofile
set noswapfile
set nobackup

set textwidth=80

set hlsearch
set incsearch
set linebreak

set wrapscan
set wrap

set ttyfast

set mouse=a

set history=10000

set wildmenu
" trigger autocompletion with ctrl+n
set wildchar=<C-n>


"make incsearch highlight usable
highlight Search ctermfg=white ctermbg=gray

"make bprevious shortcut usable on mac [usually ctrl+(l|r) arrow]
nnoremap <C-h> :bprevious<CR>
nnoremap <C-l> :bnext<CR>

" set error format to ts
compiler tsc
set makeprg=npx\ tsc

