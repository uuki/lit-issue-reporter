import { Exome } from 'exome'

class ModalContext extends Exome {
  public visible: boolean = false
  public setVisible(newValue: boolean) {
    this.visible = newValue
  }
}
export const modalContext = new ModalContext()
