set nocompatible

filetype plugin on

augroup auto_compiler
    autocmd!
    autocmd FileType typescript compiler tsc
    autocmd FileType typescript set makeprg=npx\ tsc

    autocmd FileType typescriptreact compiler tsc
    autocmd FileType typescriptreact set makeprg=npx\ tsc
augroup END

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

set textwidth=80

set hlsearch
set incsearch
set linebreak

set wrapscan
set wrap

set ttyfast

set mouse=a

set wildmenu

set history=10000

