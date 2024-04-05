import React from 'react'
import ClientsEditPage from './ClientsEditPage'
import ProjetEdit from '../components/projet/projet-edit'

const ProjetEditPage = () => {
  return (
    <>
        <ClientsEditPage showProjectList={false} />
        <ProjetEdit/>
    </>
  )
}

export default ProjetEditPage