import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Projects from '../components/Projects'

describe('Projects', () => {
  it('affiche 3 projets par défaut (filtre "Tous")', () => {
    render(<Projects />)
    expect(screen.getAllByText('Kekosan').length).toBeGreaterThan(0)
    expect(screen.getAllByText('MB Patrimoine').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Bellifood').length).toBeGreaterThan(0)
    // Le 4e projet n'est visible qu'après "voir plus"
    expect(screen.queryByText('Dépannage Gémeaux')).not.toBeInTheDocument()
  })

  it('affiche tous les projets après clic sur "voir plus"', () => {
    render(<Projects />)
    fireEvent.click(screen.getByText(/voir les/i))
    expect(screen.getAllByText('Dépannage Gémeaux').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Yojeme').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Photographe').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Restaurant Lyon').length).toBeGreaterThan(0)
  })

  it('replie les projets avec "voir moins"', () => {
    render(<Projects />)
    fireEvent.click(screen.getByText(/voir les/i))
    fireEvent.click(screen.getByText('Voir moins'))
    expect(screen.queryByText('Dépannage Gémeaux')).not.toBeInTheDocument()
  })

  it('filtre les projets par catégorie via les pills', () => {
    render(<Projects />)
    fireEvent.click(screen.getByRole('tab', { name: 'App restaurant' }))
    // Catégorie App restaurant : Kekosan + Sabai Thoiry
    expect(screen.getAllByText('Kekosan').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Sabai Thoiry').length).toBeGreaterThan(0)
    // Un projet d'une autre catégorie disparaît
    expect(screen.queryByText('MB Patrimoine')).not.toBeInTheDocument()
  })

  it('ouvre le panel d\'un projet au clic', () => {
    render(<Projects />)
    const btn = screen.getAllByText('Kekosan')[0].closest('button')
    fireEvent.click(btn)
    expect(screen.getByText(/Application web pour un restaurant/i)).toBeInTheDocument()
  })

  it('ferme le panel au second clic', () => {
    render(<Projects />)
    const btn = screen.getAllByText('Kekosan')[0].closest('button')
    fireEvent.click(btn)
    fireEvent.click(btn)
    const item = btn.closest('.proj-item')
    expect(item).not.toHaveClass('proj-item--open')
  })
})
