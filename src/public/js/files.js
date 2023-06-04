var output = [];
function handleFileSelect(evt) {
    var files = evt.target.files;
    
    for (var i = 0, f; f = files[i]; i++) {
      output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                  f.size, ' bytes, last modified: ',
                  f.lastModifiedDate.toLocaleDateString(), '</li>');
    }
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
}
document.getElementById('files').addEventListener('change', handleFileSelect, false);

function subirArchivos(){
    if (output.length =0){
        alert("Debes cargar uno o varios archivos primero!");
    }
} 