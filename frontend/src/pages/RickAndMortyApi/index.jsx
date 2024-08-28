import { useContext, useEffect, useState } from 'react'
import './styles.css'
import Card from '../../components/Card'
import Pagination from '../../components/Pagination'
import { AuthContext } from '../../Context'
import AddButton from '../../components/AddButton'
import { useNavigate } from 'react-router-dom'

export default function RickAndMortyApi() {
  const { token } = useContext(AuthContext);
  const [ conteudo, setConteudo ] = useState(<></>)
  const [ page, setPage ] = useState(1);
  const [ totalPages, setTotalPages ] = useState(1);
  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate('/character')
  }

  async function carregarTodosPersonagens() {
    var requestOptions = {
      headers: {
        authorization: token
      },
      method: 'GET',
      redirect: 'follow',
    };
    
    const result = await fetch(
      `http://localhost:3000/api/v1/character?page=${page}`,
      requestOptions
    )
      .then(response => response.text())
      .then(result => { return result })
      .catch(error => console.log('error', error));
    const response = JSON.parse(result)
    return { info: response.info, char: response.results, }
  }

  async function listaPersonagens() {
    const { char: todosPersonagens, info } = await carregarTodosPersonagens()
    setTotalPages(info.pages)

    return todosPersonagens.map(personagem =>{
      return <Card data={personagem} onClick={() => {
        navigate('/character', { state: { personagem, isUpdate: true } })
      }} />
    })
  }

  useEffect(() => {
    async function getConteudo() {
      setConteudo(await listaPersonagens())
    }
    getConteudo()
  }, [page])

  return (
    <div>
      <div className='lista-principal'>
          { conteudo }
      </div>
      <AddButton onClick={handleAddClick} />
      <Pagination 
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  )
}