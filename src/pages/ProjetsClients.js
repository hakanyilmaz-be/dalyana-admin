import React from 'react'
import { Container } from 'react-bootstrap'
import CreateNew from '../components/create-new/create-new'
import Status from '../components/status/status'
import DevisCommandeTable from '../components/devis-commande-table/devis-commande-table'
import { Link } from 'react-router-dom'


const ProjetsClients = () => {
  return (

    <Container>
     <Link to="/projets-clients/creer-client">
      <CreateNew
        title= "Créer Nouveau Client en Devis"
      />
      </Link>
      <Status/>
      <DevisCommandeTable/>
    </Container>

   
  )
}

export default ProjetsClients