
set nocompatible

syntax enable
filetype plugin on

"search recursively down
set path+=**

set number

set mouse=a

"ignore paths while searching
let g:netrw_list_hide=netrw_gitignore#Hide()
execute 'set wildignore+='.substitute(g:netrw_list_hide.',**/.git/*,**/node_modules/*','/,','/*,','g')

"display a list while fuzzy searching
set wildmenu

au BufWritePost *.c,*.cpp,*.h silent! !ctags -R &

set history=10000


" Tweaks for browsing
let g:netrw_banner=0        " disable annoying banner
"let g:netrw_browse_split=4  " open in prior window
let g:netrw_altv=1          " open splits to the right
let g:netrw_liststyle=3     " tree view
let g:netrw_list_hide=netrw_gitignore#Hide()


let data_dir = has('nvim') ? stdpath('data') . '/site' : '~/.vim'
if empty(glob(data_dir . '/autoload/plug.vim'))
  silent execute '!curl -fLo '.data_dir.'/autoload/plug.vim --create-dirs  https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim'
  autocmd VimEnter * PlugInstall --sync | source $MYVIMRC
endif

call plug#begin('~/vimplugins')

Plug 'prabirshrestha/vim-lsp'
Plug 'mattn/vim-lsp-settings'

call plug#end()

function! s:on_lsp_buffer_enabled() abort
    setlocal omnifunc=lsp#complete
    setlocal signcolumn=no
"    nmap <buffer> gi <plug>(lsp-definition)
"    nmap <buffer> gd <plug>(lsp-declaration)
"    nmap <buffer> gr <plug>(lsp-references)
"    nmap <buffer> gl <plug>(lsp-document-diagnostics)
"    nmap <buffer> <f2> <plug>(lsp-rename)
"    nmap <buffer> <f3> <plug>(lsp-hover)
endfunction

augroup lsp_install
    au!
    autocmd User lsp_buffer_enabled call s:on_lsp_buffer_enabled()
augroup END
