const Post = ({titulo, contenido, nombre, apellido}: any) => {
    const autor = nombre + " " + apellido;
    return (
        <div>
            <div>
                {titulo}
            </div>
            <div>
                {autor}
            </div>
            <p>
                {contenido}
            </p>
        </div>
    )

}

export default Post;