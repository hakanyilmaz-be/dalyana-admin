import React, { useState } from 'react'
import { Container } from 'react-bootstrap'
import CreateNew from '../components/create-new/create-new'
import Status from '../components/status/status'
import DevisCommandeTable from '../components/devis-commande-table/devis-commande-table'
import { Link } from 'react-router-dom'



const Projets = () => {
  const [filterStatus, setFilterStatus] = useState('');



  return (

    <Container>
     <Link to="/projets/creer-devis-commande">
      <CreateNew
        title= "Créer un Nouveau Projet"
      />
      </Link>

      <Status setFilterStatus={setFilterStatus} />
      <DevisCommandeTable filterStatus={filterStatus} />
    
    </Container>

   
  )
}

export default Projets